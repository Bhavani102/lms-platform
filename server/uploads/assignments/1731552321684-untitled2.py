# -*- coding: utf-8 -*-
"""Untitled2.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1cEGmWTjIomtGkzPvhPjK5zGogg6di21h
"""

import pandas as pd
# Load the Titanic dataset
df = pd.read_csv('/content/sample_data/titanic.csv')
#Print first few rows
print(df.head())
# Drop rows with any missing values
df_dropped = df.dropna()
print(df_dropped.head())

# Separate categorical and numerical columns
cat_cols = df.select_dtypes(include=['object']).columns
num_cols = df.select_dtypes(include=['float64', 'int64']).columns
# Fill missing values for categorical columns with "Unknown"
df[cat_cols] = df[cat_cols].fillna("Unknown")
# Fill missing values for numerical columns with -999 or another numerical constant
df[num_cols] = df[num_cols].fillna(-999)
print("Data after filling missing values with constants:")
print(df.head())

from sklearn.impute import SimpleImputer

# Fill missing values with mean or median based on distribution
mean_imputer = SimpleImputer(strategy='mean')
median_imputer = SimpleImputer(strategy='median')

for column in num_cols:
    if df[column].skew() < 1:
        df[column] = mean_imputer.fit_transform(df[[column]])
    else:
        df[column] = median_imputer.fit_transform(df[[column]])
print("Data after filling missing values with class-based mean/median:")
print(df.head())

# Fill missing values in each numeric column based on class mean or median
for column in num_cols:
    for label in df['Survived'].unique():
        if df[column].skew() < 1:
            df.loc[df['Survived'] == label, column] = df[df['Survived'] == label][column].fillna(df[df['Survived'] == label][column].mean())
        else:
            df.loc[df['Survived'] == label, column] = df[df['Survived'] == label][column].fillna(df[df['Survived'] == label][column].median())
print("Data after filling missing values with mean/median:")
print(df.head())

from sklearn.linear_model import LinearRegression
df = pd.read_csv('/content/sample_data/titanic.csv')
# Define predictor columns
predictor_cols = ['Fare', 'Pclass', 'SibSp', 'Parch']  # Ensure these columns exist and are not missing

# Ensure no missing values in predictor columns when fitting the model
age_data = df[['Age'] + predictor_cols].dropna()

# Initialize and fit the model
model = LinearRegression()
model.fit(age_data[predictor_cols], age_data['Age'])

# Check for missing values in 'Age'
if df['Age'].isnull().sum() > 0:
    missing_ages = df[df['Age'].isnull()]  # DataFrame with missing 'Age' values
    df.loc[df['Age'].isnull(), 'Age'] = model.predict(missing_ages[predictor_cols])  # Fill missing 'Age' values
    print("Data after filling missing values with regression prediction:")
    print(df.head())
else:
    print("No missing values in 'Age' column.")

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
# Reload the Titanic dataset and apply binning
df = pd.read_csv('/content/sample_data/titanic.csv')
fare_bins = pd.qcut(df['Fare'], q=4, duplicates='drop') # quartile-based binning
df['Fare_Binned'] = fare_bins.apply(lambda x: x.mid) # Replace with bin midpoint
# Print the corrected data with binned 'Fare'
print("Data after binning (Fare replaced with bin midpoint):")
print(df[['Fare', 'Fare_Binned']].head(10))
# Visualization
plt.figure(figsize=(10, 6))
plt.hist(df['Fare'], bins=30, color='blue', alpha=0.7, label='Original Fare')
plt.hist(df['Fare_Binned'], bins=4, color='red', alpha=0.5, label='Binned Fare')
plt.legend()
plt.xlabel("Fare")
plt.ylabel("Frequency")
plt.title("Binning of 'Fare' Column")
plt.show()

from sklearn.linear_model import LinearRegression
# Define predictor columns
predictor_cols = ['Pclass', 'Age', 'SibSp', 'Parch']

# Drop rows with missing values in predictors and create a copy for safety
df_clean = df.dropna(subset=predictor_cols + ['Fare']).copy()
# Set up the regression model to predict 'Fare' based on other features
X = df_clean[predictor_cols]
y = df_clean['Fare']
model = LinearRegression()
model.fit(X, y)
# Predict and calculate residuals
df_clean['Fare_Predicted'] = model.predict(X)
df_clean['Fare_Residual'] = df_clean['Fare'] - df_clean['Fare_Predicted']
# Plot original vs predicted fares
plt.figure(figsize=(10, 6))
plt.scatter(df_clean['Fare'], df_clean['Fare_Predicted'], alpha=0.5, label='Predicted Fare')
plt.plot([df_clean['Fare'].min(), df_clean['Fare'].max()], [df_clean['Fare'].min(), df_clean['Fare'].max()], 'r--')
plt.xlabel("Original Fare")
plt.ylabel("Predicted Fare")
plt.legend()
plt.title("Fare Prediction Using Regression")
plt.show()

from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
# Assuming 'df' is your Titanic dataset with 'Fare' and 'Age' columns
# Drop rows with missing 'Fare' or 'Age' for clustering
df_clustering = df[['Fare', 'Age']].dropna()
# Standardize the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df_clustering)
# Determine the optimal eps using the k-distance graph
neighbors = NearestNeighbors(n_neighbors=5)
neighbors_fit = neighbors.fit(X_scaled)
distances, indices = neighbors_fit.kneighbors(X_scaled)
# Sort distances and plot the k-distance graph
distances = np.sort(distances[:, -1], axis=0)
plt.figure(figsize=(10, 6))
plt.plot(distances)
plt.xlabel("Points sorted by distance")
plt.ylabel("k-distance")
plt.title("k-distance Graph for Epsilon Selection")
plt.show()

# Set up and apply DBSCAN with selected eps and min_samples
dbscan = DBSCAN(eps=0.4, min_samples=5)
clusters = dbscan.fit_predict(X_scaled)
# Create a copy of the filtered dataframe and add cluster labels
df_clustering['Cluster'] = clusters
# Merge the cluster labels back into the original DataFrame
df = df.merge(df_clustering[['Cluster']], left_index=True, right_index=True, how='left')
# Count number of points in each cluster
cluster_counts = df['Cluster'].value_counts(dropna=False)
print("Cluster counts:")
print(cluster_counts)
# Plot clusters with color coding for each cluster
plt.figure(figsize=(10, 6))
plt.scatter(df['Fare'], df['Age'], c=df['Cluster'], cmap='viridis', alpha=0.6)
plt.xlabel('Fare')
plt.ylabel('Age')
plt.title('DBSCAN Clustering on Titanic Data')
plt.colorbar(label='Cluster Label')
plt.show()

# Identify and plot outliers separately
outliers = df[df['Cluster'] == -1]
# Plotting clusters (non-outliers) and outliers distinctly
plt.figure(figsize=(10, 6))
# Plot non-outliers (clustered points)
plt.scatter(df[df['Cluster'] != -1]['Fare'],
df[df['Cluster'] != -1]['Age'],
c=df[df['Cluster'] != -1]['Cluster'],
cmap='viridis', alpha=0.6, label='Clusters')
# Plot outliers
plt.scatter(outliers['Fare'], outliers['Age'],
c='red', marker='x', s=100, label='Outliers')
plt.xlabel('Fare')
plt.ylabel('Age')
plt.title('DBSCAN Clustering with Outliers on Titanic Data')
plt.colorbar(label='Cluster Label')
plt.legend()
plt.show()

pip install PyWavelets

import pandas as pd
import pywt
import matplotlib.pyplot as plt
data=pd.read_csv('/content/sample_data/titanic.csv')
data['Fare'] = data['Fare'].fillna(data['Fare'].mean())
# Apply Discrete Wavelet Transform on 'Fare'
coeffs = pywt.wavedec(data['Fare'], 'db1', level=2)
approximation = coeffs[0]
# Pad approximation to match original length
approximation_padded = pd.Series(approximation).reindex(range(len(data['Fare'])), fill_value=approximation[-1])
# Display transformed data with approximation values
output = pd.DataFrame({'Original Fare': data['Fare'], 'Fare Approximation': approximation_padded})
print(output.head(10))
# Plot
plt.figure(figsize=(10, 5))
plt.plot(data['Fare'], label='Original Fare', alpha=0.7)
plt.plot(approximation_padded, label='Wavelet Transformed (Approximation)', alpha=0.7)
plt.title('Wavelet Transform on Fare')
plt.legend()
plt.show()

from sklearn.decomposition import PCA
# Select numeric features and apply PCA
numeric_features = ['Pclass', 'Age', 'Fare']
data[numeric_features] = data[numeric_features].fillna(data[numeric_features].mean())
pca = PCA(n_components=2)
pca_result = pca.fit_transform(data[numeric_features])
data['PCA1'] = pca_result[:, 0]
data['PCA2'] = pca_result[:, 1]
# Display the first few rows
print(data[['Pclass', 'Age', 'Fare', 'PCA1', 'PCA2']].head(10))
# Plot the PCA results
plt.figure(figsize=(8, 6))
plt.scatter(data['PCA1'], data['PCA2'], c=data['Pclass'], cmap='viridis', alpha=0.7)
plt.colorbar(label='Pclass')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('PCA on Titanic Dataset')
plt.show()

import pandas as pd
from sklearn.feature_selection import SelectKBest, f_classif
import matplotlib.pyplot as plt
# Selecting features and handling missing data
features = ['Pclass', 'Age', 'SibSp', 'Parch', 'Fare']
data[features] = data[features].fillna(data[features].mean())
# Select top 2 features based on F-test
selector = SelectKBest(f_classif, k=2)
selected_features = selector.fit_transform(data[features], data['Survived'])
# Get selected feature names
mask = selector.get_support() # Get boolean mask of selected features
selected_feature_names = [feature for bool, feature in zip(mask, features) if bool]
print("Selected Features:", selected_feature_names)
# Visualization of the selected features
plt.figure(figsize=(8, 6))
plt.scatter(selected_features[:, 0], selected_features[:, 1], c=data['Survived'], cmap='coolwarm', alpha=0.7)
plt.colorbar(label='Survived')
plt.xlabel(selected_feature_names[0])
plt.ylabel(selected_feature_names[1])
plt.title('Top 2 Features by F-test')
plt.show()

# Select features for regression and handle missing data
X = data[['Pclass', 'Age', 'SibSp', 'Parch']].fillna(data[['Pclass', 'Age', 'SibSp', 'Parch']].mean())
y = data['Fare'].fillna(data['Fare'].mean())
# Linear regression model to predict 'Fare'
reg_model = LinearRegression()
reg_model.fit(X, y)
data['Fare_predicted'] = reg_model.predict(X)
# Visualizing actual vs predicted Fare
plt.figure(figsize=(10, 5))
plt.plot(data['Fare'], label='Actual Fare', alpha=0.7)
plt.plot(data['Fare_predicted'], label='Predicted Fare', alpha=0.7)
plt.xlabel('Passenger Index')
plt.ylabel('Fare')
plt.title('Regression: Predicted vs. Actual Fare')
plt.legend()
plt.show()

from sklearn.preprocessing import MinMaxScaler
# Min-Max Scaling on Age and Fare
scaler_min_max = MinMaxScaler()
data[['Age_minmax', 'Fare_minmax']] = scaler_min_max.fit_transform(data[['Age', 'Fare']])
# Display normalized values
print(data[['Age', 'Age_minmax', 'Fare', 'Fare_minmax']].head(10))
# Plot the Min-Max normalized 'Age'
plt.figure(figsize=(10, 5))
plt.plot(data['Age'], label='Original Age', alpha=0.7)
plt.plot(data['Age_minmax'], label='Min-Max Normalized Age', alpha=0.7)
plt.xlabel('Passenger Index')
plt.ylabel('Age')
plt.title('Min-Max Normalization on Age')
plt.legend()
plt.show()

from sklearn.preprocessing import StandardScaler
# Handle missing values in 'Age' and 'Fare' columns
data['Age'] = data['Age'].fillna(data['Age'].mean())
data['Fare'] = data['Fare'].fillna(data['Fare'].mean())
# Z-score Normalization on 'Age' and 'Fare'
scaler_z = StandardScaler()
data[['Age_zscore', 'Fare_zscore']] = scaler_z.fit_transform(data[['Age', 'Fare']])
# Display the first few rows of original and Z-score normalized columns
output = data[['Age', 'Age_zscore', 'Fare', 'Fare_zscore']]
print(output.head(10))
# Plot Z-score normalized 'Fare' values
plt.figure(figsize=(10, 5))
plt.plot(data['Fare'], label='Original Fare', alpha=0.7)
plt.plot(data['Fare_zscore'], label='Z-Score Normalized Fare', alpha=0.7)
plt.xlabel('Passenger Index')
plt.ylabel('Fare')
plt.title('Z-Score Normalization on Fare')
plt.legend()
plt.show()

from sklearn.preprocessing import KBinsDiscretizer
# Binning Age into 5 bins
binning = KBinsDiscretizer(n_bins=5, encode='ordinal', strategy='uniform')
data['Age_binned'] = binning.fit_transform(data[['Age']])
# Display binned Age values
print(data[['Age', 'Age_binned']].head(10))
# Plot histogram of binned Age
plt.figure(figsize=(8, 5))
plt.hist(data['Age_binned'], bins=5, edgecolor='black')
plt.xlabel('Age Binned')
plt.ylabel('Frequency')
plt.title('Equal-Width Binning of Age')
plt.show()

# Using a histogram to visualize Fare distribution and grouping
plt.figure(figsize=(8, 5))
plt.hist(data['Fare'], bins=10, edgecolor='black')
plt.xlabel('Fare')
plt.ylabel('Frequency')
plt.title('Histogram of Fare')
plt.show()

from sklearn.cluster import KMeans
# Clustering 'Fare' into 3 clusters as a form of discretization
kmeans = KMeans(n_clusters=3, random_state=0)
data['Fare_cluster'] = kmeans.fit_predict(data[['Fare']])
# Visualization of clusters
plt.figure(figsize=(8, 5))
plt.scatter(data.index, data['Fare'], c=data['Fare_cluster'], cmap='viridis', alpha=0.7)
plt.xlabel('Passenger Index')
plt.ylabel('Fare')
plt.title('Clustering-Based Discretization of Fare')
plt.colorbar(label='Cluster')
plt.show()

from sklearn.cluster import KMeans

# Clustering 'Fare' into 3 clusters as a form of discretization
kmeans = KMeans(n_clusters=3, random_state=0)
df['Fare_cluster'] = kmeans.fit_predict(df[['Fare']])

# Visualization of clusters
plt.figure(figsize=(8, 5))
plt.scatter(df.index, df['Fare'], c=df['Fare_cluster'], cmap='viridis', alpha=0.7)
plt.xlabel('Passenger Index')
plt.ylabel('Fare')
plt.title('Clustering-Based Discretization of Fare')
plt.colorbar(label='Cluster')
plt.show()

# Sampling without replacement
sample_size = 10
sample_without_replacement = df.sample(n=sample_size, replace=False)  # replace=False is the default
print(sample_without_replacement)
# Sampling with replacement
sample_size = 20
sample_with_replacement = df.sample(n=sample_size, replace=True)
print(sample_with_replacement)

import random
# Define clusters (e.g., 'Embarked' as a proxy for clusters)
clusters = df['Embarked'].unique()

# Number of clusters to sample
num_clusters_to_sample = 2  # Adjust this number based on your needs

# Sample clusters with replacement
sampled_clusters = random.choices(clusters, k=num_clusters_to_sample)

# Create the sample by selecting all observations from sampled clusters
cluster_sample_with_replacement = df[df['Embarked'].isin(sampled_clusters)]
print(cluster_sample_with_replacement)
# Sample clusters without replacement
num_clusters_to_sample = 1  # Adjust this number based on your needs

# Sample clusters without replacement
sampled_clusters = random.sample(list(clusters), num_clusters_to_sample)  # Convert clusters to a list

# Create the sample by selecting all observations from sampled clusters
cluster_sample_without_replacement = df[df['Embarked'].isin(sampled_clusters)]
print(cluster_sample_without_replacement)

from sklearn.model_selection import train_test_split

# Stratified sampling based on a categorical column (e.g., 'Sex')
strata = df['Sex']

# Perform stratified sampling without replacement
train_indices, test_indices = train_test_split(df.index, test_size=0.2, stratify=strata)

# Split the data into train and test sets
train_data = df.loc[train_indices]
test_data = df.loc[test_indices]

print("Training Set:\n", train_data.head())
print("Test Set:\n", test_data.head())

from scipy.stats import chi2_contingency

# Contingency table for Chi-square test (e.g., Survived vs Pclass)
contingency_table = pd.crosstab(df['Survived'], df['Pclass'])

# Perform Chi-square test
chi2, p_value, dof, expected = chi2_contingency(contingency_table)

print(f"Chi-square statistic: {chi2}")
print(f"P-value: {p_value}")
print(f"Degrees of freedom: {dof}")
print(f"Expected frequencies:\n{expected}")