import PocketBase from "pocketbase";
import { parseHTML } from "linkedom";

export default {
  async scheduled(event: any, env: any, ctx: any) {
    const pb = new PocketBase(env.PUBLIC_PB_URL);

    try {
      await pb
        .collection("_superusers")
        .authWithPassword(env.PB_EMAIL, env.PB_PASSWORD);

      const result = await pb.collection("deals").getList(1, 50, {
        sort: "-created",
      });
      deals = result.items;
      console.log(deals);

      // 2. Định nghĩa các sàn cần quét
      const targetUrls = [
        { url: "https://www.ebay.com/b/iPhone/9355/bn_7110031", store: "eBay" },
      ];

      for (const target of targetUrls) {
        const response = await fetch(target.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        if (!response.ok) continue;

        const html = await response.text();
        const { document } = parseHTML(html);

        // Logic bóc tách sản phẩm (Selector mẫu cho eBay)
        const items = document.querySelectorAll(".s-item__wrapper");

        for (const item of items) {
          const title = item.querySelector(".s-item__title")?.textContent;
          const priceStr = item.querySelector(".s-item__price")?.textContent;

          if (title && priceStr) {
            const price = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));

            // Kiểm tra sản phẩm đã tồn tại chưa
            const existing = await pb.collection("deals").getList(1, 1, {
              filter: `name = "${title.replace(/"/g, "'")}"`,
            });

            if (existing.items.length === 0) {
              await pb.collection("deals").create({
                name: title,
                price: price,
                old_price: price * 1.2, // Giả lập giá cũ
                store: target.store,
                url: target.url,
                category: "Electronics",
                is_hot: price < 500,
              });
              console.log(`[Scraper] Added: ${title}`);
            }
          }
        }
      }
    } catch (err) {
      console.error("[Scraper Error]", err.message);
    }
  },

  // Cho phép trigger bằng URL để kiểm tra (với mã bí mật)
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.searchParams.get("key") !== env.SCRAPE_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    ctx.waitUntil(this.scheduled(null, env, ctx));
    return new Response("Scraper manual trigger started...");
  },
};
