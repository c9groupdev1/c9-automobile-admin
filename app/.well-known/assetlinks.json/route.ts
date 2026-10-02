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
      "sha256_cert_fingerprints": []
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
