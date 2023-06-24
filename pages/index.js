import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }





  return (
    <div>
      <Head>
        <title>mAIster gAIrdener - Your AI Master Gardener</title>
        <link rel="icon" href="/maister_gairdener.png" />
      </Head>

      <main className={styles.main}>
        <img src="/maister_gairdener.png" className={styles.icon}/>
        <h2>mAIster gAIrdener</h2>
        <div className={styles.about}>
          <h3>How it works:</h3>
          <ol>
            <li>Submit your email</li>
            <li>We'll ask for your location</li>
            <li>We'll use your location and today's date to create a garden plan specific to your region</li>
          </ol>
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Enter your email"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Get Your Free Garden Plan!" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
