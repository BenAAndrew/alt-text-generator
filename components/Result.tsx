const Result = ({ imageToAlt, newPage }: { imageToAlt: { [key: string]: string }, newPage: string }) => {
    const handleDownload = () => {
        const blob = new Blob([newPage], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'page.html';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={handleDownload}>
                Download HTML
            </button>
            <table>
                <tr>
                    <th style={{ width: "40%" }}></th>
                    <th style={{ width: "60%" }}></th>
                </tr>
                {Object.entries(imageToAlt).map(
                    ([url, alt]) => (<tr>
                        <td>
                            <img src={url} style={{ width: "150px" }} />
                        </td>
                        <td>
                            <p>"{alt}"</p>
                        </td>
                    </tr>)
                )}
            </table>
        </>

    );
};

export default Result;

