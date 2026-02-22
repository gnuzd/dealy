export default {
  async scheduled(_event: any, env: any, _ctx: any) {
    // const pb = new PocketBase(env.PUBLIC_PB_URL);

    try {
      const authRes = await fetch(
        `${env.PB_URL}/api/collections/users/auth-with-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identity: env.PB_EMAIL,
            password: env.PB_PASSWORD,
          }),
        },
      );

      const auth = await authRes.json();
      if (!auth.token) throw new Error("PocketBase Auth Failed");
      const token = auth.token;

      const res = await fetch(
        `${env.PB_URL}/api/collections/targets/records?filter=(active=true)`,
        { headers: { Authorization: token } },
      );
      const targetUrls = await res.json();

      const promises: Promise<any>[] = [];
      targetUrls.items.forEach((item: any) => {
        promises.push(this.handleFetch(token, env, item));
      });

      await Promise.all(promises);
    } catch (err: any) {
      console.error("[Scraper Error]", err.message);
    }
  },

  // Cho phép trigger bằng URL để kiểm tra (với mã bí mật)
  async fetch(request: any, env: any, ctx: any) {
    const url = new URL(request.url);
    if (url.searchParams.get("key") !== env.SCRAPE_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    ctx.waitUntil(this.scheduled(null, env, ctx));
    return new Response("Scraper manual trigger started...");
  },

  async handleFetch(token: string, env: any, item: any) {
    try {
      const response = await fetch(item.url, {
        headers: {
          Authorization: env[item.auth],
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      const { data } = await response.json();

      if (Array.isArray(data)) {
        const batchSize = 10;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);

          await Promise.all(
            batch.map(async (dt) => {
              const res = await fetch(
                `${env.PB_URL}/api/collections/offers/records?filter=(external_id='${dt.id}')`,
                { headers: { Authorization: token } },
              );
              const existing = await res.json();
              if (existing.items && existing.items.length > 0) {
                // UPDATE: Nếu đã tồn tại
                const existingId = existing.items[0].id;
                await fetch(
                  `${env.PB_URL}/api/collections/offers/records/${existingId}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token,
                    },
                    body: JSON.stringify({
                      ...dt,
                      country_code: item.country_code,
                    }),
                  },
                );
              } else {
                const { id, ...rest } = dt;
                await fetch(`${env.PB_URL}/api/collections/offers/records`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                  body: JSON.stringify({
                    ...rest,
                    external_id: id,
                    country_code: item.country_code,
                  }),
                });
              }
            }),
          );
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
