import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xezskqvkmsggqvcloumq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlenNrcXZrbXNnZ3F2Y2xvdW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTI1NTYsImV4cCI6MjA1MzEyODU1Nn0.ypqT6q8t1ezZLGc2HmyztD9n_3G8XqwU6nIUCd6v_NM"
);

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}

export default App;
