import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userEmail, setUserEmail] = useState("");
  const [result, setResult] = useState();



  const generateResponse = async (locationData) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locationData }),
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

  const getLocation = async () => {
    document.querySelector(`.${styles.result}`).textContent = "One moment while we generate your garden plan..."
    if ('geolocation' in navigator) {
      await navigator.geolocation.getCurrentPosition(
        async (position) => {
          const {longitude, latitude} = position.coords;
          const {timestamp} = position;
          generateResponse({ longitude, latitude, timestamp})
        },
        (error) => {
          console.alert('We had trouble getting your location. Please try again.', error.message);
        }
      );
    } else {
      console.alert('Geolocation is not supported by this browser. Try Google Chrome.');
    }
  }



  const onSubmit = async (event) => {
    event.preventDefault();
    getLocation();
    // in real app, validate and handle email submission here
  }


  const displayPlan = (result) => {
    const plan = JSON.parse(result);
    return (
      <div className={styles.result}>
        <h3>Your Garden Plan</h3>
        <div>
          <h4>Zone: {plan.zone}</h4>
          <h4>Season: {plan.season}</h4>
          <h4>Conditions: {plan.conditions}</h4>
          <h4>Plants:</h4>
          <ul>
            {plan.plants.map((plant, index) => (
              <li key={index}>{plant}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Plan:</h4>
          <ol>
            {plan.plan.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
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
            placeholder="Enter your (fake) email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <input type="submit" value="Get Your Free Garden Plan!" />
        </form>
        <div className={styles.result}>
          {result && result !== '' ? displayPlan(result.trim()) : ''}
        </div>
      </main>
    </div>
  );
}
