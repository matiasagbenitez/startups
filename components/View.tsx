import React from "react";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import Ping from "./Ping";

const View = async ({ id }: { id: string }) => {
  //   const { views: totalViews } = await client.fetch(STARTUP_VIEWS_QUERY, { id });

  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  return (
    <div className="view-container border border-black-300 rounded-lg relative">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};

export default View;
