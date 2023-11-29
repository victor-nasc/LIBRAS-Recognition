# Libras Alphabet Transcriber


## :bulb: Inspiration

LIBRAS stands for "_Língua Brasileira de Sinais_", translating to **Brazilian Sign Language** in English. It serves as the primary mode of communication for millions of deaf individuals in Brazil.

The development of a Libras Alphabet Transcriber in real-time using Machine Learning is crucial for promoting inclusivity and accessibility for the deaf community in Brazil. 
While numerous projects have focused on American Sign Language (ASL), there is a noticeable gap in the availability of tools specifically tailored to Libras.

The application provides educational advantages by creating inclusive learning environments for students who are deaf or hard of hearing, as well as for individuals interested on learning Libras.

Leveraging technology to bridge the communication gap is essential for creating a more inclusive society :blush:

This project was made for AI4GOOD [Brazil Conference](https://www.brazilconference.org/) at Harvard & MIT 2024

## :computer: What it does

![Example](https://gizmodo.uol.com.br/wp-content/blogs.dir/8/files/2021/02/nyan-cat-1.gif)


The Libras Alphabet Transcriber is a Python program that employs Computer Vision and Machine Learning techniques to recognize and transcribe gestures of the Brazilian Sign Language (LIBRAS)
alphabet in real-time using your webcam. The program utilizes a Hand Tracking module to detect hand landmarks, and, based on their coordinates, employs a machine learning algorithm 
to classify and transcribe the corresponding sign language alphabet.

### :gear: Available Machine Learning Models [Keras](https://keras.io/) / [scikit-learn](https://scikit-learn.org/stable/)
- KNN [default model]
- Random Forest
- SVM
- Logistic Regression
- Neural Network


## :hammer: How we built it
- ```main.py```: Real-time transcriber:
   1. Opens your webcam
   2. Obtains your hand positions using the [CVZone](https://github.com/cvzone/cvzone) Hand Tracking Module
   3. Normalizes hand landmark coordinates 
   4. Makes predictions using the selected model
   5. Display results in an [OpenCV](https://opencv.org/) window
- ```train.ipynb```
  Training and results of different machine learning models.
- ```./dataset```
  The folder where the data is saved and the script to collect it
- ```./models```
  The folder where all models are saved


## :x: Limitations

Libras is a language with many rules, and creating a program capable of capturing and transcribing the signs of an entire language is challenging. Therefore, we need to make significant adaptations to the program to align it with the nuances of Libras and the short timeframe of the hackathon.

The main limitation arose when dealing with signs involving movements, leading to the exclusion of the letters H, J, K, X, and Z. This restriction highlights the complexity of encoding and efficiently representing dynamic gestures in the context of computing as a whole. Therefore, the next step is to adapt the program for these cases involving movement.

Developing a transcriptor for the alphabet with missing letters may seem like a silly idea, but it underscores the importance of recognizing the difficulties of Libras. Encouraging more in-depth studies in this area is crucial to continually improve accessibility technologies and promote more effective inclusion of sign languages in the digital era.


## :camera: Usage
- Hold the same gesture for 10 frames to register it.

- Lift your hand off the screen to input a spacebar.

  
```bash
# clone the repository
git clone https://github.com/victor-nasc/LIBRAS-Recognition.git

# install dependencies
pip install -r requirements.txt

# Run the program
python3 main.py 

# Available models:
# python3 main.py --model=MODEL_NAME (knn is the defalt)
#     - knn 
#     - rf     (random forest)
#     - svm
#     - logreg (logistic regression)
#     - nn     (neural network)
```

## Authors
Victor Nascimento Ribeiro - [LinkedIn](https://www.linkedin.com/in/victor-nasc/)

Gustavo Vaz Pinto - [LinkedIn](https://www.linkedin.com/in/gust-vaz/)

Eduardo Cruz Guedes - [LinkedIn](https://www.linkedin.com/in/educg550/)

