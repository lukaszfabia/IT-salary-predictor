import { Layout } from "../../components/Layout";
import author from "../../assets/author.jpeg";

export default function About() {
    return (
        <Layout>
            <div className="flex justify-center items-center h-screen">
                <div className="w-96">
                    <figure>
                        <img
                            className="w-36 h-auto rounded-full mx-auto border-4"
                            src={author.src}
                            alt="About"
                        />
                        <figcaption className="font-medium text-center mt-6">
                            <div className="text-sky-500 dark:text-sky-400">Lukasz Fabia</div>
                            <div className="text-slate-700 dark:text-slate-500">
                                CS student at WUST
                            </div>
                            <div>
                                <p className="text-lg font-sans font-light p-4 text-gray-300">
                                    I wanted to create model to predict salaries based on variables in
                                    offers to get knowladge how much can i earn as a Junior
                                    programmer. Whats more I could use it for my Data Science project.
                                    I used data from{" "}
                                    <a className="underline" href="https://justjoin.it">
                                        justjoin.it
                                    </a>{" "}
                                    to create dataset. Results of my work are presented at this
                                    website.
                                </p>
                            </div>
                        </figcaption>
                    </figure>
                </div>
            </div>
        </Layout>
    );
}
