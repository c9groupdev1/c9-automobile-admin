import { NextResponse } from "next/server";

export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID || "6C4KJ3S777";
  const appID = `${teamId}.com.c9x.automobile`;
  const appIDs = [appID, "com.c9x.automobile", "*.com.c9x.automobile"];

  const aasa = {
    "applinks": {
      "apps": [],
      "details": [
        {
          "appIDs": appIDs,
          "appID": appID,
          "paths": [
            "/marketplace/*",
            "/app/marketplace/*"
          ],
          "components": [
            {
              "/": "/marketplace/*",
              "comment": "Matches all car listing detail and search pages"
            },
            {
              "/": "/app/marketplace/*",
              "comment": "Matches app marketplace URLs"
            }
          ]
        }
      ]
    },
    "webcredentials": {
      "apps": [appID, "com.c9x.automobile"]
    }
  };

  return NextResponse.json(aasa, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
