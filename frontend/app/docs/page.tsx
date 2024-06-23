"use client";

import { Suspense, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import api from "@/lib/api";
import { Metrics } from "@/lib/types";
import LoadingSpinner from "@/components/LoadingSpinner";

function TableOfContents() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Table of contents</h1>
      <ol className="list-decimal list-inside py-4 mx-5 text-lg space-y-2">
        <a href="#scrapper">
          <li>
            <span className="underline hover:text-blue-500 transition ease-in-out">
              Getting data for model
            </span>
          </li>
        </a>
        <a href="#preprocessing">
          <li>
            <span className="underline hover:text-blue-500 transition ease-in-out">
              Preprocessing data
            </span>
          </li>
        </a>
        <a href="#learning_models">
          <li>
            <span className="underline hover:text-blue-500 transition ease-in-out">
              Choosen models for predicting salary
            </span>
          </li>
        </a>
        <ul className="mx-10 mt-2 list-disc">
          <li>Hyperparameter tuning</li>
          <li>Getting best model</li>
          <li>Fitting data and some vistualizations</li>
        </ul>
      </ol>
    </>
  );
}

function TemplateForContent({
  anchor,
  title,
  children,
}: {
  anchor: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-10">
      <h1 className="text-bold text-3xl" id={`${anchor}`}>
        {title}
        <a
          href="#scrapper"
          className="text-transparent hover:text-violet-800 transition ease-in-out"
        >
          #
        </a>
      </h1>
      <div className="py-5">{children}</div>
    </div>
  );
}

function Scrapper() {
  return (
    <TemplateForContent anchor="scrapper" title="Getting data for model">
      To get a lot of IT offers, I have chosen{" "}
      <a
        href="https://justjoin.it"
        target="_blank"
        className="text-blue-500 hover:text-blue-300 transition ease-in-out"
      >
        justjoin.it
      </a>
      - a popular job board in Poland. The next step was to create a scraper
      based on Selenium. I decided to take information about salary on B2B and
      employment contracts, experience, technologies, city, and operating mode.
      To handle technologies, I created a dictionary with the most popular
      technologies and their synonyms, the same with cities. To avoid a large
      number of technologies.
    </TemplateForContent>
  );
}

function Preprocessing() {
  return (
    <TemplateForContent anchor="preprocessing" title="Preprocessing data">
      Cleaning date in this case was very significant. I had to fix cities one
      more time and explode them because when there was a offer that was in two
      cities it&apos;s like we have two offers. The same with technologies. Next
      importatns step was to fix salary because there were offers with salary in
      range, so I had to calculate the mean value. Of course I had to remove
      some offers with hourly salary or very big salary in the result I &apos;ve
      been collecting offers with salary from [1000, 40000] PLN. Also I had to
      add new feature - contract type because there were offers with salary in
      range and I had to know if it&apos;s B2B or employment contract and in
      this place I&apos;ve also explode this column. The last step was to encode
      categorical data, using{" "}
      <a
        href="https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html"
        className="text-blue-500 hover:text-blue-300 transition ease-in-out"
      >
        LabelEncoder
      </a>{" "}
      then I encoded technologies by{" "}
      <a
        href="https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MultiLabelBinarizer.html"
        className="text-blue-500 hover:text-blue-300 transition ease-in-out"
      >
        MultiLabelBinarizer
      </a>{" "}
      - 0 if offer doesn&apos;t include it else 1. Last thing was to save ready
      data to MongoDB. Result of this preprocessing you can see{" "}
      <a
        href="/stats"
        className="text-blue-500 hover:text-blue-300 transition ease-in-out"
      >
        here
      </a>
      .
    </TemplateForContent>
  );
}

function ChoosingBestModel() {
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  useEffect(() => {
    api
      .get<Metrics[]>("/metrics/")
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setMetrics]);

  const title = "Choosen models for predicting salary";
  const anchor = "learning_models";
  return (
    <TemplateForContent anchor={anchor} title={title}>
      I&apos;ve been testing models of Linear Regression, Random Forest,
      Gradient Boosting, Decision Tree or even SVM. But the best model was
      RandomForestRegreesor and GradientBoostingRegressor. I&apos;ve been using{" "}
      <a
        href="https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html"
        className="text-blue-500 hover:text-blue-300 transition ease-in-out"
      >
        GridSearchCV
      </a>{" "}
      to find the best hyperparameters for these models.
      <br />
      <br />
      Metrics for two best models:
      <div className="flex justify-center items-center py-10">
        <Suspense fallback={<LoadingSpinner />}>
          <table className="table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">Model</th>
                <th className="border px-4 py-2">R2</th>
                <th className="border px-4 py-2">MAE</th>
                <th className="border px-4 py-2">RMSE</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{metric.model}</td>
                  <td className="border px-4 py-2">{metric.r2.toFixed(2)}</td>
                  <td className="border px-4 py-2">{metric.mae.toFixed(2)}</td>
                  <td className="border px-4 py-2">{metric.rmse.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Suspense>
      </div>
    </TemplateForContent>
  );
}

export default function Docs() {
  return (
    <Layout>
      <div className="mx-5 flex flex-wrap py-28">
        <div className="px-8 pt-6 pb-8 mb-4">
          <TableOfContents />
          <Scrapper />
          <Preprocessing />
          <ChoosingBestModel />
        </div>
      </div>
    </Layout>
  );
}
