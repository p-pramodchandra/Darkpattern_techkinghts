from flask import Flask, request, jsonify
import pickle
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)


with open('modified_lstm_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('modified_lstm_model.pkl', 'rb') as f:
    tokenizer = pickle.load(f)


class_mapping = {
    0: 'Urgency',
    1: 'Not Dark Pattern',
    2: 'Scarcity',
    3: 'Social Proof'
}


def predict_class(text):
    
    sequences = tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(sequences, maxlen=100)  

    
    predicted_probabilities = model.predict(np.array(padded_sequence))

    
    predicted_class = np.argmax(predicted_probabilities)


    predicted_class_name = class_mapping[predicted_class]

    return predicted_class_name

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        text_to_predict = data.get('text', '')

    
        predicted_class_name = predict_class(text_to_predict)

        return jsonify({'predicted_class': predicted_class_name}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
