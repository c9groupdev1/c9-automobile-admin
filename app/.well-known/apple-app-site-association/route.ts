import { NextResponse } from "next/server";

export async function GET() {
  const aasa = {
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": [
          "*.com.c9x.automobile",
          "com.c9x.automobile"
        ],
        "components": [
          {
            "/": "/marketplace/*",
            "comment": "Matches car detail listings"
          },
          {
            "/": "/app/marketplace/*",
            "comment": "Matches app car detail listings"
          }
        ]
      }
    ]
  },
  "webcredentials": {
    "apps": [
      "com.c9x.automobile"
    ]
  }
};
  return NextResponse.json(aasa, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
