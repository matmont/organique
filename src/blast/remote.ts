import { writeFile } from "fs/promises";
import type { INCBISearchOptions, INCBIResultOptions } from "./ncbi";

export async function scheduleRemoteSearch(options: INCBISearchOptions) {
  const URL = `https://blast.ncbi.nlm.nih.gov/Blast.cgi`;
  const entries = Object.entries(options).map(
    ([k, v]) => [k, String(v)] as [string, string]
  );

  const payload = `CMD=Put&${new URLSearchParams(entries).toString()}`;

  const res = await fetch(URL, {
    body: payload,
    method: "POST",
    headers: {
      "User-Agent": "OrganiqueClient",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    keepalive: true,
  });

  const text = await res.text();

  const ridMatch = text.match(/RID = (\S+)/);
  const rtoeMatch = text.match(/RTOE = (\d+)/);
  const rid = ridMatch?.[1];
  const rtoe = rtoeMatch?.[1];

  if (!rid || !rtoe) {
    console.error("Something went wrong during request");
    return null;
  }

  return {
    requestIdentifier: rid,
    requestTimeOfExecution: +rtoe,
  };
}

export async function pollRemoteResult(options: INCBIResultOptions) {
  const URL = `https://blast.ncbi.nlm.nih.gov/Blast.cgi`;
  const entries = Object.entries(options).map(
    ([k, v]) => [k, String(v)] as [string, string]
  );

  const payload = `CMD=Get&${new URLSearchParams(entries).toString()}`;

  const res = await fetch(URL, {
    body: payload,
    method: "POST",
    headers: {
      "User-Agent": "OrganiqueClient",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    keepalive: true,
  });

  return await res.text();
}
