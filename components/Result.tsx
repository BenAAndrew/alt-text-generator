const Result = ({
  imageToAlt,
  newPage,
}: {
  imageToAlt: { [key: string]: string };
  newPage: string;
}) => {
  const handleDownload = () => {
    const blob = new Blob([newPage], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "page.html";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={handleDownload}
      >
        Download HTML
      </button>
      <table>
        <tr>
          <th className="w-1/5"></th>
          <th className="w-4/5"></th>
        </tr>
        {Object.entries(imageToAlt).map(([url, alt]) => (
          <tr key={url} className="h-20">
            <td>
              <img src={url} className="w-20" alt={alt} />
            </td>
            <td>
              <p>&quot;{alt}&quot;</p>
            </td>
          </tr>
        ))}
      </table>
    </>
  );
};

export default Result;
