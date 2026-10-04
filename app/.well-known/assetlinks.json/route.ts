import { NextResponse } from "next/server";

export async function GET() {
  const assetlinks = [
    {
      "relation": [
        "delegate_permission/common.handle_all_urls"
      ],
      "target": {
        "namespace": "android_app",
        "package_name": "com.c9x.automobile",
        "sha256_cert_fingerprints": [
          "83:68:3A:0B:92:4A:96:0A:59:7A:73:87:97:F8:48:EE:6C:47:03:C9:00:48:2E:11:1F:46:AA:83:EA:83:C2:FB"
        ]
      }
    }
  ];
  return NextResponse.json(assetlinks, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
