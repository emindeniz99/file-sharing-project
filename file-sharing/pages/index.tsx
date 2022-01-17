import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [result, setresult] = useState("");
  const router = useRouter();
  const { id: queryParamID } = router.query;
  useEffect(() => {
    if (typeof queryParamID === "string") {
      setresult(queryParamID);
    }
  }, [queryParamID]);
  return (
    <div className={styles.container}>
      <Head>
        <title>File Sharing App</title>
        <meta
          name="description"
          content="File Sharing App - CMPE48A Cloud Computing Project"
        />
        <link rel="icon" href="/favicon.gif" />
      </Head>

      <main className={styles.main}>
        {result && (
          <div>
            <h1>Download - Share</h1>
            <div
              onClick={() => {
                window.open("/api/get?id=" + result);
              }}
              style={{
                margin: "1rem",
                border: "thick double #32a1ce",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              Download
            </div>

            <div
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.origin + "?id=" + result
                );
                toast.success("Copied to clipboard!", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }}
            >
              <input
                type="url"
                value={window.location.origin + "?id=" + result}
                disabled
                style={{
                  width: "90%",
                }}
              />
            </div>
            {navigator.share && (
              <div
                onClick={() => {
                  navigator
                    .share({
                      url: window.location.origin + "?id=" + result,
                    })
                    .then(() => console.log("Successful share"))
                    .catch((error) => console.log("Error sharing", error));
                }}
                style={{
                  margin: "1rem",
                  border: "thick double #32a1ce",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                Share
              </div>
            )}
          </div>
        )}

        <h1>File Upload</h1>
        <div>
          <input
            type="file"
            onChange={(event) => {
              setselectedFile(
                event.target?.files ? event.target?.files[0] : null
              );
            }}
          />
          <button
            onClick={() => {
              if (selectedFile) {
                // Create an object of formData
                const formData = new FormData();

                // Update the formData object
                formData.append("theFiles", selectedFile);

                const options = {
                  method: "POST",
                  body: formData,
                };

                fetch("/api/upload", options)
                  .then((response) => response.json())
                  .then((response) => {
                    console.log(response);
                    setresult(response.result.Key);
                    toast.success("Uploaded successfully!", {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    navigator.clipboard.writeText(
                      window.location.origin + "?id=" + response.result.Key
                    );
                    router.push("/?id=" + response.result.Key);
                  })
                  .catch((err) => console.error(err));
              }
            }}
          >
            Upload!
          </button>
        </div>

        <br />
      </main>
      {process.env.NEXT_PUBLIC_githubLink && (
        <footer className={styles.footer}>
          <a
            href={process.env.NEXT_PUBLIC_githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>GitHub</div>
          </a>
        </footer>
      )}
    </div>
  );
};

export default Home;
