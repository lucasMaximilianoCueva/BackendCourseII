// @deno-types="https://deno.land/x/servest/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import { createApp } from "https://deno.land/x/servest/mod.ts";

const app = createApp();

const colors: any[] = [];

app.post("/", async (req) => {
  const body = await req.formData();
  const color = body.value("color");

  colors.push(color);
});

app.handle("/", async (req) => {
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html; charset=UTF-8",
    }),
    body: ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Deno Servest</title>
        </head>
        <body style={{ backgroundColor: "black" }}> 
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div>
          <form action="/" method="post">
            <p style={{ color: "gray" }}>Type a color</p>
            <input type="text" name="color" />
            <button>Send</button>
          </form>
          </div>
          <div style={{ backgroundColor: "#303030", width: 200 }}>
          <ul>
              {colors.map((color) => (
                <li style={{ color }}>
                  <b>{color}</b>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </body>
      </html>
    ),
  });
});
app.listen({ port: 8888 });
