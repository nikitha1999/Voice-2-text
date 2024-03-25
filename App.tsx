import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Voice from 'react-native-voice';

const App = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [globalResult, setGlobalResult] = useState('');

  useEffect(() => {
    let intervalId: any;
    
    Voice.onSpeechStart = () => {
      setIsListening(true);
    };
  
    Voice.onSpeechPartialResults = (e) => {
      const text = e.value[0];
      console.log(text);
      // Clear e.value[0] every 10 seconds
      if (!intervalId) {
        intervalId = setInterval(() => {
          const clearedText = ''; // Clear e.value[0]
          e.value[0] = clearedText;
        }, 10000);
      }
      setRecognizedText(text);
      
      const count = text.split(/\s+/).filter((word) => word.trim() !== '').length;
      setWordCount(count);
      setGlobalResult(text);
    };
  
    Voice.onSpeechEnd = () => {
      setIsListening(false);
      clearInterval(intervalId);
      intervalId = null;
    };
  
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      clearInterval(intervalId);
    };
  }, []);
  
  

  const startRecording = async () => {
    try {
      const options = {
        EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
        EXTRA_PARTIAL_RESULTS: true,
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 120000,
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 8000,
      };
      await Voice.start('en-US', options);
    } catch (error) {
      console.log('error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headingText}>Voice to Text Recognition</Text>
        <View style={styles.textInputStyle}>
          <TextInput
            value={globalResult}
            multiline={true}
            placeholder="Say something!"
            style={{
              flex: 1,
              height: '100%',
            }}
            onChangeText={(text) => setRecognizedText(text)}
          />
        </View>
        <Text style={styles.wordCountText}>Word Count: {wordCount}</Text>
        <View style={styles.btnContainer}>
          {isListening ? (
            <TouchableOpacity onPress={stopRecording} style={styles.stop}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording} style={styles.speak}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Speak</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 26,
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 300,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
    color: '#000',
  },
  speak: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  stop: {
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
    marginTop: 24,
  },
  wordCountText: {
    alignSelf: 'center',
    marginVertical: 10,
    fontSize: 18,
  },
  globalResultText: {
    alignSelf: 'center',
    marginVertical: 10,
    fontSize: 18,
    fontStyle: 'italic',
  },
});

export default App;
