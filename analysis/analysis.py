#!/usr/bin/env python
# coding: utf-8

# # Tutaj jest rozwiązanie problemu, przekonwertowane na skrypt pythonowy, bo ipynb jest zbyt duże
# można przekonwertować do ipynb za pomocą `jupytext analysis.py --to notebook`

# # Zaczynamy od importu bibliotek

# In[ ]:


import pandas as pd 
import matplotlib.pyplot as plt 
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from typing import Dict, List
import numpy as np
from sklearn.linear_model import LinearRegression, Ridge, Lasso
import os
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import GridSearchCV


# # Przetwarzanie danych
# 
# ## Zapis i naprawa danych z formatu JSON do CSV.
# 
# W tym kroku usuwamy zbędne dane i przygotowujemy dane do analizy, kodując zmienne.
# 
# Najwazniejsze kroki to:
# - normalizacja miast
# - kodowanie zmiennych kategorycznych (np. miasta, typ pracy, kontrakty)
# - wzięcie średniej zarobków potem usunięcie widełek w zarobkach (np. 10-15k -> 12.5k)
# - rozbicie ofert pracy dla kontraktów oraz miasta np. mamy ofertę dla miasta A i B obie mają podane
# zarobki na b2b i uop, więc powstaną 4 nowe oferty, czyli A_uop, A_b2b, B_uop, B_b2b.
# - zapis do pliku pomocniczego
# 

# In[ ]:


locations_synonyms: Dict[str, List[str]] = {
    "Warszawa": ["Warsaw", "Warszawa", "Katowice; Warszawa", "Warszawa (Centrum)", "Waraszawa"],
    "Kraków": ["Krakow", "Kraków"],
    "Wrocław": ["Wroclaw", "Wrocław"],
    "Poznań": ["Poznan", "Poznań", "Pozanań"],
    "Gdańsk": ["Gdansk", "Gdańsk"],
    "Szczecin": ["Szczecin", "szczecin"],
    "Łódź": ["Lodz", "Łódź"],
    "Rzeszów": ["Rzeszow", "Rzeszów"],
    "Katowice": ["Katowice", "Katowice; Warszawa"],
    "Kielce": ["Kielce"],
    "Opole": ["opole", "Opole"],
    "Sopot": ["Sopot"],
    "Olszytn": ["Olsztyn"],
    "Gdynia": ["Gdynia"],
}

location_encoder = LabelEncoder()
exp_encoder = LabelEncoder()
mode_encoder = LabelEncoder()

# read data from json file
df = pd.read_json("../data/offers.json")

def replace_synonyms(locations):
    for standard, synonyms in locations_synonyms.items():
        for i, loc in enumerate(locations):
            if loc in synonyms:
                locations[i] = standard
    return locations

def split_contracts(row):
    contracts = []
    if row['min_b2b'] > 0 or row['max_b2b'] > 0:
        new_row_b2b = row.copy()
        new_row_b2b['min_uop'] = 0
        new_row_b2b['max_uop'] = 0
        new_row_b2b['avg_salary'] = (new_row_b2b['min_b2b'] + new_row_b2b['max_b2b']) / 2
        new_row_b2b['contract_type'] = 'B2B'
        contracts.append(new_row_b2b)
    if row['min_uop'] > 0 or row['max_uop'] > 0:
        new_row_uop = row.copy()
        new_row_uop['min_b2b'] = 0
        new_row_uop['max_b2b'] = 0
        new_row_uop['avg_salary'] = (new_row_uop['min_uop'] + new_row_uop['max_uop']) / 2
        new_row_uop['contract_type'] = 'UoP'
        contracts.append(new_row_uop)
    return contracts

split_rows = df.apply(lambda row: pd.DataFrame(split_contracts(row)), axis=1)
df = pd.concat(split_rows.values.tolist(), ignore_index=True)

contract_type_encoder = LabelEncoder()
df["contract_type_code"] = contract_type_encoder.fit_transform(df["contract_type"])
df = df.drop(columns=["contract_type", "min_b2b", "max_b2b", "min_uop", "max_uop"])

df["locations"] = df["locations"].apply(replace_synonyms)
df = df.explode("locations")
df["location"] = df["locations"]

df["location_code"] = location_encoder.fit_transform(df["location"])

df["experience_code"] = exp_encoder.fit_transform(df["experience"])
df["operating_mode_code"] = mode_encoder.fit_transform(df["operating_mode"])
df = df.drop(columns=["locations", "operating_mode", "experience", "location"])

mlb = MultiLabelBinarizer()

df = df.join(pd.DataFrame(mlb.fit_transform(df.pop('technologies')), # usuwanie kolumny technologies i dodanie nowych kolumn
                          columns=mlb.classes_, # nazwy nowych kolumn
                          index=df.index)) # indeksy nowych kolumn


df.to_csv("../data/offers_normalized_locations.csv", index=False)    


# ## Usuwanie niepotrzebnych danych
# 
# Na wszelki wypadek usuwam niepotrzebne dane, które mogą być niepotrzebne w przyszłości.
# <p style="color: red">W przypadku ofert pracy gdzie nie ma definiowanych widełek dla np. b2b nie będę ich próbował wyliczać, bo nie ma to sensu, ponieważ zarobki zależą od technologi i poziomu doświadczenia.</p> 
# 
# Usuwamy tytuł oferty i oferty, które miały stawkę godzinową, ponieważ nie wiemy ile godzin w tygodniu jest do
# przepracowania.
# 

# In[ ]:


offers = pd.read_csv("../data/offers_normalized_locations.csv")

offers = offers.drop_duplicates()
offers = offers.dropna()
# usuwanie outlinerów
rows_to_drop = offers[(offers['avg_salary'] < 1000) | (offers['avg_salary'] > 40000)].index
offers = offers.drop(rows_to_drop)
offers = offers.drop(columns=["title"])

offers.columns = offers.columns.str.strip()

offers.to_csv("../data/jobs.csv", index=False)


# # Szybki look na dane
# 
# Dane po preprocessingu wyglądają tak:

# In[ ]:


data = pd.read_csv('../data/jobs.csv')
df = pd.DataFrame(data)

display(df.head())


# # Ilość ofert pracy

# In[ ]:


display(pd.DataFrame({"ofert" : [len(df)]}))


# # Statystyki zarobków na poszczególnych kontrakatach oraz doświadczeniach

# In[ ]:


exp_code = df["experience_code"].value_counts().index
exp_name = exp_encoder.inverse_transform(exp_code)
contracts = df["contract_type_code"].value_counts().index
contracts_name = contract_type_encoder.inverse_transform(contracts)

for exp in exp_name:
    exp_code = exp_encoder.transform([exp])[0]
    for contract in contracts_name:
        contract_code = contract_type_encoder.transform([contract])[0]
        subset = df[(df["experience_code"] == exp_code) & (df["contract_type_code"] == contract_code)]
        print(f"Experience: {exp}, Contract Type: {contract}")
        display(subset.iloc[:, :1].describe().round(2))


# # Tworzymy histogramy
# 
# Proponuje następujące rozkłady:
# - typu pracy
# - doświadczenia
# - zarobków
# - technologii
# - lokalizacji
# 
# 
# Zacznijmy od napisania funkcji która będzie tworzyć histogramy dla każdej z tych kategorii.

# In[ ]:


def get_histogram(data, column_name, title, encoder, label_x="", label_y="", is_specified=False, exp=None):
    if is_specified:
        exp_code = exp_encoder.transform([exp])[0]
        print(f"Experience: {exp}")
        data = data[data["experience_code"] == exp_code]

    value_counts = data[column_name].value_counts().head(12)
    
 
    location_names = encoder.inverse_transform(value_counts.index)
    value_counts.index = location_names
    print(value_counts)
    
    # Tworzenie wykresu kołowego
    plt.figure(figsize=(8, 8))
    value_counts.plot(kind='pie', autopct='%1.1f%%')
    plt.xlabel(label_x)
    plt.ylabel(label_y)
    plt.title(title)
    plt.tight_layout()
    plt.savefig(f"plots/rozkłady/{title.lower().replace(" ", "_")}.png")
    plt.show()



# In[ ]:


def compute_amount_offers_for(exp):
    exp_code = exp_encoder.transform([exp])[0]
    offers_amount = df['experience_code'].value_counts()[exp_code]
    print(f"Liczba ofert pracy dla {exp}a:", offers_amount)
    return offers_amount
    
mid_offers = compute_amount_offers_for("Mid")
senior_offers  = compute_amount_offers_for("Senior")
junior_offers =  compute_amount_offers_for("Junior")

assert mid_offers + senior_offers + junior_offers == len(df)


# ## Histogram typu pracy

# In[ ]:


get_histogram(df, 'operating_mode_code', 'Typy pracy', encoder=mode_encoder)


# ## Histogram doświadczenia

# In[ ]:


get_histogram(df, 'experience_code', title="Rozkład doświadczenia", label_x="", label_y="", encoder=exp_encoder)


# # Rozkład zarobków na B2B

# In[ ]:


def salary_distribution(data, exp, encoder=exp_encoder, color='skyblue'):
    exp_code = encoder.transform([exp])[0]
    b2b, uop = contract_type_encoder.transform(["B2B", "UoP"])
    df_filtered_b2b = data[(data["experience_code"] == exp_code) & (data["contract_type_code"] == b2b)].copy()

    print(f"Rozkład wynagrodzeń dla {exp}, liczba ofert z b2b: {len(df_filtered_b2b)}")

    plt.figure(figsize=(10, 6))

    sns.kdeplot(df_filtered_b2b['avg_salary'], color=color, label='B2B')

    df_filtered_uop = data[(data["experience_code"] == exp_code) & (data["contract_type_code"] == uop)].copy()
    
    print(f"Rozkład wynagrodzeń dla {exp}, liczba ofert z uop: {len(df_filtered_uop)}")

    sns.kdeplot(df_filtered_uop['avg_salary'], color='red', label='UOP')

    plt.title(f"Rozkład zarobków {exp}a")
    plt.xlabel(f"Średnie wynagrodzenie {exp}a")
    plt.ylabel("Gęstość ofert")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"plots/rozkłady/pensje_dla_{exp.lower()}a.png")
    plt.show()


# In[ ]:


salary_distribution(df, "Mid")
salary_distribution(df, "Senior")
salary_distribution(df, "Junior")


# # Rozkład popularności technologii

# In[ ]:


def popularity(data, start_column, end_column, title, xlabel, ylabel, figsize=(22, 6), color='blue'):
    technologies = data.loc[:, start_column:end_column]

    sum_of_tech = technologies.sum().sort_values(ascending=False)

    plt.figure(figsize=figsize)
    sum_of_tech.plot(kind='bar', color=color)
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.xticks(rotation=90)
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(f"plots/rozkłady/{title.lower().replace(" ", "_")}.png")
    plt.show()


# In[ ]:


popularity(df, 'AWS', 'android', 'Popularne technologie', 'Technologie', 'Liczba ofert')


# # Rozkład lokalizacji

# In[ ]:


get_histogram(df, 'location_code', 'Popularne lokalizacje', location_encoder, label_x="", label_y="")


# In[ ]:


get_histogram(df, 'location_code', 'Popularne miasta wśród ofert dla juniorów', location_encoder, label_x="", label_y="", is_specified=True, exp="Junior")


# # Macierz korelacji techonlogii
# 
# Czy jakieś techonologie idą ze sobą w parze.
# 

# In[ ]:


def create_corr_plot(corr, title, size=(20,20)):
    plt.figure(figsize=size)
    sns.heatmap(corr, annot=True,fmt=".2f", linecolor="lightgrey", linewidths=0.5, cmap="flare")
    sns.color_palette("flare", as_cmap=True)
    plt.title(title)
    plt.tight_layout()
    plt.savefig(f"plots/korelacje/{title.lower().replace(" ", "_")}.png")
    plt.show()


# In[ ]:


technologies = df.loc[:, "AWS": "android"].columns.tolist()
corr = df[technologies].corr()
corr = corr.abs()
create_corr_plot(corr, 'Korelacja między technologiami')


# In[ ]:


technologies = df.loc[:, "AWS": "android"].columns.tolist()
corr_matrix = df[technologies].corr().abs()

mask = corr_matrix > 0.15

filtered_corr = corr_matrix[mask]

create_corr_plot(filtered_corr, 'Korelacja między technologiami')


# # Macierz korelacji wybranych zmiennych

# In[ ]:


vars = ["avg_salary", "contract_type_code", "operating_mode_code", "experience_code", "location_code"]

corr = data[vars].corr()
corr = corr.abs()

create_corr_plot(corr, 'Korelacja między zmiennymi', size=(6,6))



# # Zarobki a technologie

# In[ ]:


techs = data.loc[:, "AWS": "android"]

b2b, uop = contract_type_encoder.transform(["B2B", "UoP"])

uop_data = data[data['contract_type_code'] == uop]

b2b_data = data[data['contract_type_code'] == b2b]

uop_salaries = ["avg_salary"]
uop_all_vars = uop_salaries + list(techs.columns)
uop_corr = uop_data[uop_all_vars].corr()
uop_corr = uop_corr.abs()  
uop_corr = uop_corr.loc[uop_salaries, techs.columns] 

create_corr_plot(uop_corr, "Zarobki na UoP a technologie", size=(20, 4))

b2b_salaries = ["avg_salary"]
b2b_all_vars = b2b_salaries + list(techs.columns)
b2b_corr = b2b_data[b2b_all_vars].corr()
b2b_corr = b2b_corr.abs()  
b2b_corr = b2b_corr.loc[b2b_salaries, techs.columns] 

create_corr_plot(b2b_corr, "Zarobki na B2B a technologie", size=(20, 4))


# # Korelacja technologii a lokalizacji

# In[ ]:


corr = data[["location_code"] + list(techs.columns)].corr()
corr = corr.abs()
corr = corr.loc[techs.columns, ["location_code"]]
create_corr_plot(corr, "Lokalizacja a technologie", size=(2, 20))


# # Przygotowanie modeli
# 
# Wybrałem modele:
# - regresja liniowa w trzech wariantach
#    - Ridge
#    - Lasso
#    - LinearRegression
# - Random Forest (podobno dobry model)
# - Decision Tree  

# In[ ]:


models_to_tune = {
    'Linear_Regression':{
        'model':LinearRegression(),
        'params':{}
    },
    'Decision_Tree':{
        'model':DecisionTreeRegressor(),
        'params':{
            'max_depth':[2,4,6,8,10],
            'random_state':[0,42],
            'min_samples_split':[2,5,10,20]
        }
    },
    'Random_Forest':{
        'model':RandomForestRegressor(),
        'params':{
            'n_estimators':[10,30,20,50,80]
        }
    },
    'Ridge':{
        'model':Ridge(),
        'params':{
            'alpha':[0.1,0.5,1,2,5,10]
        }
    },
    'Lasso': {
        'model': Lasso(),
        'params': {
            'alpha': [0.1, 0.5, 1, 2, 5, 10]
        }
    }
}


# In[ ]:


# Hyper parameter tuning through grid search cv

def tune_models(x_train, y_train):
    scores = []

    for name, value in models_to_tune.items():
        clf = GridSearchCV(value['model'], value['params'], cv=5, scoring='neg_mean_squared_error')
        clf.fit(x_train, y_train)

        scores.append({
            'Model': name,
            'Params': clf.best_params_,
            'MSE(-ve)': clf.best_score_
        })
    pd.DataFrame(scores).to_csv("models_tuning.csv", index=False)


# In[ ]:


parameters_for_models = pd.read_csv('models_tuning.csv')

model_params = {}

for index, row in parameters_for_models.iterrows():
    model_name = row['Model']
    params = eval(row['Params'])
    model_params[model_name] = params

n_estimators = model_params['Random_Forest']['n_estimators']

max_depth = model_params['Decision_Tree']['max_depth']
min_samples_split = model_params['Decision_Tree']['min_samples_split']
random_state = model_params['Decision_Tree']['random_state']

alpha_ridge = model_params['Ridge']['alpha']

alpha_lasso = model_params['Lasso']['alpha']

models = [
    LinearRegression(), DecisionTreeRegressor(max_depth=max_depth, min_samples_split=min_samples_split, random_state=random_state),
    RandomForestRegressor(n_estimators=n_estimators), Ridge(alpha=alpha_ridge),
    Lasso(alpha=alpha_lasso)
]


# In[ ]:


class Plotter:
    """class for plotting results of models
    """
    
    def __init__(self, data, y_pred, y_train, y_test, test_size, model_title, model_params) -> None:
        self.data = data
        self.y_pred = y_pred
        self.y_train = y_train
        self.y_test = y_test
        self.test_size = test_size
        self.model_title = model_title
        self.model_params = self.preprocess_params(model_params)
        self.dest = f"plots/wyniki/{1-self.test_size}&{self.test_size}/{self.model_title}/"
        
        if not os.path.exists(self.dest):
            os.makedirs(self.dest)
            
    
    def preprocess_params(self, params):
        match self.model_title:
            case "DecisionTreeRegressor":
                return f"max_depth: {params['max_depth']}, min_samples_split: {params['min_samples_split']}, random_state: {params['random_state']}"
            case "RandomForestRegressor":
                return f"n_estimators: {params['n_estimators']}"
            case "Ridge":
                return f"alpha: {params['alpha']}"
            case "Lasso":
                return f"alpha: {params['alpha']}"
            case _:
                return ""
        
    
    def get_plots(self):
        self.plot_salary_distribution()
        self.plot_with_errors()
        self.scatter_plot()
        # ...
    
    def plot_salary_distribution(self):
        plt.figure(figsize=(14, 6))

        sns.kdeplot(self.data['avg_salary'], color='blue', label=f"Rzeczywiste zarobki")

        sns.kdeplot(self.y_pred, color='orange', label=f"Przewidziane zarobki")

        plt.title(f"Rozkład dla {self.model_title}({self.model_params})")
        plt.xlabel(f"Zarobki (PLN)")
        plt.ylabel("Gęstość ofert")
        plt.legend()

        plt.tight_layout()
        plt.grid(True)
        plt.savefig(self.dest + "salary_dist.png")
        plt.show()

    
    def plot_with_errors(self):
        errors = self.y_test - self.y_pred   
        plt.figure(figsize=(14, 6))
        plt.hist(errors, bins='auto')
        plt.xlabel('Przedziały błędów predykcji')
        plt.ylabel('Ilość')
        plt.title(f'Histogram błędów predykcji dla {self.model_title}({self.model_params})')
        plt.grid(True)
        plt.savefig(self.dest + "errors.png")
        plt.show()
    
    def scatter_plot(self):
        plt.figure(figsize=(14, 6))
        plt.scatter(self.y_test, self.y_pred)
        plt.xlabel('Prawdziwe dane')
        plt.ylabel('Przewidziane dane')
        plt.plot([self.y_test.min(), self.y_test.max()], [self.y_test.min(), self.y_test.max()], color='red') 
        plt.title(f'Prawdziwe vs Przewidziane zarobki dla {self.model_title}({self.model_params})')
        plt.grid(True)
        plt.savefig(self.dest + "scatter.png")
        plt.show()


# # Wybieramy najlepszy model

# In[ ]:


def get_best_model(models, x_train, x_test, y_train, y_test, test_size=0.2):    
    metrics_list = []
    
    def eval_model(model, x_train, x_test, y_train, y_test):
        model.fit(x_train, y_train)
        # score = model.score(x_test, y_test)
        y_pred = model.predict(x_test)
        score = np.sqrt(mean_squared_error(y_test, y_pred))
        metrics = {
            "Model": model.__class__.__name__,
            "Mean Absolute Error": mean_absolute_error(y_test, y_pred).round(2),
            "Root Mean Squared Error": score.round(2),
            "R^2 Score": r2_score(y_test, y_pred)
        }
        
        plotter = Plotter(data=data, y_pred=y_pred, y_train=y_train, y_test=y_test, test_size=test_size, model_title=model.__class__.__name__, model_params=model.get_params())
        plotter.get_plots()
        
        return score, metrics

    best_score = float('inf')
    best_model = None
    
    tune_models(x_train, y_train)

    for model in models:
        score, metrics = eval_model(model, x_train, x_test, y_train, y_test)
        if score < best_score:
            best_score = score
            best_model = model
        metrics_list.append(metrics)
    
    metrics_df = pd.DataFrame(metrics_list)
    dest = f"plots/wyniki/{1-test_size}&{test_size}/metrics.csv"
    metrics_df.to_csv(dest, index=False)
                
    return best_model


# In[ ]:


def create_model_other_method(data, test_size=0.2):
    tmp_data = data.copy()
 
    features = tmp_data.drop(columns=["avg_salary"], axis=1)
    lables = tmp_data[['avg_salary']]
    
    salary = lables["avg_salary"]
    
    x_train, x_test, y_train, y_test = train_test_split(features, salary, test_size=test_size, random_state=42)
    
    best_model = get_best_model(models, x_train, x_test, y_train, y_test, test_size=test_size)
    
    return best_model


# In[ ]:


model = create_model_other_method(data, test_size=0.2)


# In[ ]:


other_model = create_model_other_method(data, test_size=0.4)


# In[ ]:


def preprocess_input(**params):
  location_code = location_encoder.transform([params["location"]])[0]
  exp_code = exp_encoder.transform([params["exp"]])[0]
  operating_mode_code = mode_encoder.transform([params["operating_mode"]])[0]
  tech_stack = mlb.transform([params["tech_stack"]])[0]
  contract_type_code = contract_type_encoder.transform([params["contract_type"]])[0]
  
  res = np.concatenate([[contract_type_code, location_code, exp_code, operating_mode_code], tech_stack]).reshape(1, -1)
  return pd.DataFrame(res)


# In[ ]:


def plot_impotance(model, data):
    importances = model.feature_importances_
    features = data.columns
    indices = np.argsort(importances)[::-1]
    plt.figure(figsize=(20, 12))
    plt.title("Jak bardzo cechy wypływały na zarobek")
    plt.bar(range(data.shape[1]), importances[indices], align="center")
    plt.xticks(range(data.shape[1]), [features[i] for i in indices], rotation=90)
    plt.xlim([-1, data.shape[1]])
    plt.tight_layout()
    plt.savefig("../analysis/plots/wyniki/importance_of_vars.png")
    plt.show()


# In[ ]:


test_uop = {
    "location": "Wrocław",
    "exp": "Junior",
    "operating_mode": "Remote",
    "contract_type": "UoP",
    "tech_stack": ["Docker/Kubernetes", "Python", "React", "TypeScript", "JavaScript", "HTML", "CSS"]
}

test_b2b = {
    "location": "Wrocław",
    "exp": "Junior",
    "operating_mode": "Remote",
    "contract_type": "B2B",
    "tech_stack": ["Docker/Kubernetes", "Python", "React", "TypeScript", "JavaScript", "HTML", "CSS"]
}

test_backend = {
    "location": "Warszawa",
    "exp": "Senior",
    "operating_mode": "Remote",
    "contract_type": "B2B",
    "tech_stack": ["Docker/Kubernetes", "AWS",  "Go", "Linux", "React", "JavaScript", "Azure"]
}


# In[ ]:


input_data_uop = preprocess_input(**test_uop)
input_data_b2b = preprocess_input(**test_b2b)
input_data_backend = preprocess_input(**test_backend)


# In[ ]:


inputs = [input_data_uop, input_data_b2b, input_data_backend] 


# In[ ]:


def simulation(inputs, model):
    for index, input in enumerate(inputs):
        input.columns = model.feature_names_in_
        salary_pred = model.predict(input)
        
        location = location_encoder.inverse_transform([input["location_code"][0]])[0]
        exp = exp_encoder.inverse_transform([input["experience_code"][0]])[0]
        operating_mode = mode_encoder.inverse_transform([input["operating_mode_code"][0]])[0]
        contract_type = contract_type_encoder.inverse_transform([input["contract_type_code"][0]])[0]
        tech_stack = mlb.inverse_transform(input.iloc[:, 4:].values)[0]
        
        
        res_df = pd.DataFrame({
            "miasto": [location],
            "doświadczenie": [exp],
            "typ_pracy": [operating_mode],
            "umowa": [contract_type],
            "zarobki": [salary_pred.mean().round(2)],
            "technologie": [", ".join(tech_stack)]
        }, index=[index])
        
        display(res_df)
    


# In[ ]:


simulation(inputs, model)


# In[ ]:


import pickle

with open('../models/model.pkl', 'wb') as file:
    pickle.dump(model, file)


# # Zapis encoderów

# In[ ]:


with open('../encoders/location_encoder.pkl', 'wb') as file:
    pickle.dump(location_encoder, file)
    
with open('../encoders/exp_encoder.pkl', 'wb') as file:
    pickle.dump(exp_encoder, file)
    
with open('../encoders/contract_type_encoder.pkl', 'wb') as file:
    pickle.dump(contract_type_encoder, file)
    
with open('../encoders/tech_stack.pkl', 'wb') as file:
    pickle.dump(mlb, file)
    
with open('../encoders/operating_mode.pkl', 'wb') as file:
    pickle.dump(mode_encoder, file)


# In[ ]:


plot_impotance(model, data.drop(columns=['avg_salary'], axis=1))

