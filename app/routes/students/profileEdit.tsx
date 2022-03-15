import React from "react";
import { json, LoaderFunction } from "remix";
import { getSession } from "~/lib/session.server";
import EditProfile from "~/src/components/students/EditProfile";

export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directl
  let session = await getSession(request.headers.get("cookie"));
  const data = session.get("user");

  return json({ ...data });
};

export default function Students() {
  return <EditProfile />;
}
