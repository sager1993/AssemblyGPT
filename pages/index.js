import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [roleInput, setRoleInput] = useState("");
  const [adviceInput, setAdviceInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: roleInput, advice: adviceInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setRoleInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
        <h3>Give me advice</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="role"
            placeholder="Enter your role"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
          />
          <input
            type="text"
            name="advice"
            placeholder="What advice you need"
            value={adviceInput}
            onChange={(e) => setAdviceInput(e.target.value)}
          />
          <input type="submit" value="Generate advice" />
        </form>

        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
