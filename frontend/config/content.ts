import { Step } from "@/types";

export const solutionSteps: Step[] = [
    { name: "Choose models and params for them", desc: "I chose 2 models: RandomForestRegressor, GradientBoostingRegressor, because rest of models I was trying, gave me high errors and low R2 coef." },
    { name: "Hyperparameters tuning", desc: "I used GridSearchCV to find best hyperparameters for models and save it." },
    { name: "Model evaluation", desc: "I used RMSE error to find best model. I also used R2 coef to check how good model is." },
    { name: "Model and enocder saving", desc: "I saved model and enocders to use it in my API. You can download them." },
]

export const handlingFeatures: Step[] = [
    { name: "Technologies/Locations", desc: "matching value from offer to their defined synonyms." },
    { name: "Salary range", desc: "taking average value for B2B and UoP." },
]

export const steps: Step[] = [
    { name: "Writting a scrapper", desc: "I wrote a scrapper and then I could wrap raw data in obejct." },
    { name: "Exploding data", desc: "I had to explode data to get all possible values for example city in offer." },
    { name: "Encoding categorical data", desc: "I had to encode categorical data to numerical values." },
    { name: "Data cleaning", desc: "I had to clean data, remove duplicates and fill missing values." },
]