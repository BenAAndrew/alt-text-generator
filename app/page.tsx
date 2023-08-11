"use client";

import * as cheerio from "cheerio";
import Form from "@/components/Form";
import ProgressBar from "@/components/ProgressBar";
import { extractDomain, isValidURL, generateAltText } from "@/app/main";
import { useState } from "react";
import Result from "@/components/Result";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [imageToAlt, setImageToAlt] = useState({});
  const [newPage, setNewPage] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setProgressMessage("Loading web page");

    const url = event.target.url.value;
    const response = await fetch(url);
    if (response.status !== 200) {
      alert("Invalid web page");
      setIsLoading(false);
      return;
    }
    const html = await response.text();

    const domain = extractDomain(url);
    const $ = cheerio.load(html);
    const images = $("img");

    if (images.length === 0){
      alert("No images found");
      setIsLoading(false);
      return;
    }
    setProgressMessage(`${images.length} images found`);

    const imageToAlt: { [key: string]: string } = {};
    let processed = 0;

    for (const image of images.slice(0,2)) {
      const src = $(image).attr("src")!;
      const url = isValidURL(src) ? src : `${domain}/${src}`;
      const altText = await generateAltText(url);
      imageToAlt[url] = altText;
      $(image).attr("alt", altText);
      processed += 1;
      setProgress(Math.round((processed / images.length) * 100));
      setProgressMessage(`${processed}/${images.length} images processed`);
    }

    const newPage = $.html();
    setImageToAlt(imageToAlt);
    setNewPage(newPage);
  };

  return (
    <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full hover:shadow-2xl transition">
      <div className="px-8 pt-6 pb-8">
        {Object.keys(imageToAlt).length > 0 ? (
          <Result imageToAlt={imageToAlt} newPage={newPage}/>
        ) : isLoading ? (
          <ProgressBar
            progressPercentage={progress}
            message={progressMessage}
          />
        ) : (
          <Form handleSubmit={handleSubmit} />
        )}
      </div>
    </section>
  );
}
