#!/usr/bin/env python
# coding: utf-8

# # Tutaj jest rozwiązanie problemu, przekonwertowane na skrypt pythonowy, bo ipynb jest zbyt duże
# można przekonwertować do ipynb za pomocą `jupytext analysis.py --to notebook`


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



popularity(df, 'AWS', 'android', 'Popularne technologie', 'Technologie', 'Liczba ofert')



get_histogram(df, 'location_code', 'Popularne lokalizacje', location_encoder, label_x="", label_y="")



get_histogram(df, 'location_code', 'Popularne miasta wśród ofert dla juniorów', location_encoder, label_x="", label_y="", is_specified=True, exp="Junior")


def create_corr_plot(corr, title, size=(20,20)):
    plt.figure(figsize=size)
    sns.heatmap(corr, annot=True,fmt=".2f", linecolor="lightgrey", linewidths=0.5, cmap="flare")
    sns.color_palette("flare", as_cmap=True)
    plt.title(title)
    plt.tight_layout()
    plt.savefig(f"plots/korelacje/{title.lower().replace(" ", "_")}.png")
    plt.show()


technologies = df.loc[:, "AWS": "android"].columns.tolist()
corr = df[technologies].corr()
corr = corr.abs()
create_corr_plot(corr, 'Korelacja między technologiami')


technologies = df.loc[:, "AWS": "android"].columns.tolist()
corr_matrix = df[technologies].corr().abs()

mask = corr_matrix > 0.15

filtered_corr = corr_matrix[mask]

create_corr_plot(filtered_corr, 'Korelacja między technologiami')


vars = ["avg_salary", "contract_type_code", "operating_mode_code", "experience_code", "location_code"]

corr = data[vars].corr()
corr = corr.abs()

create_corr_plot(corr, 'Korelacja między zmiennymi', size=(6,6))



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



corr = data[["location_code"] + list(techs.columns)].corr()
corr = corr.abs()
corr = corr.loc[techs.columns, ["location_code"]]
create_corr_plot(corr, "Lokalizacja a technologie", size=(2, 20))


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
