"use client";
import { useState } from "react";

import Blob1 from "../../components/Blob1";
import { Layout } from "../../components/Layout";
import Navbar from "../../components/Navbar";

export default function SalaryCalculator() {
  const [city, setCity] = useState("warsaw");

  return (
    <Layout>
      <form className="max-w-sm mx-auto py-4">
        <select
          id="countries"
          name="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Choose city</option>
          <option value="warsaw">Warsaw</option>
          <option value="krakow">Krakow</option>
          <option value="wroclaw">Wroclaw</option>
        </select>
        radio buttons
      </form>
    </Layout>
  );
}
