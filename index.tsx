import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';

const { height, width } = Dimensions.get('window');

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Enter a city');
      return;
    }

    try {
      const apiKey = '6720f611a47b44b8bbb73009250307';
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.trim()}`
      );
      const data = await response.json();

      if (data.error) {
        setError('City not found');
        setWeather(null);
      } else {
        setWeather(data);
        setError('');
        Keyboard.dismiss();
      }
    } catch (err) {
      setError('Failed to fetch');
      setWeather(null);
    }
  };

  const getWeatherImage = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('fog') || lower.includes('mist')) return require('../assets/images/foggy.png');
    if (lower.includes('rain')) return require('../assets/images/rainy.png');
    if (lower.includes('cloud')) return require('../assets/images/cloudy.png');
    if (lower.includes('sun') || lower.includes('clear')) return require('../assets/images/sunny.png');
    return require('../assets/images/default.png');
  };

  const backgroundImage = weather
    ? getWeatherImage(weather.current.condition.text)
    : require('../assets/images/default.png');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.inner}>
            <Text style={styles.title}>🌤️Weather App</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter city 🔍"
              placeholderTextColor="#666"
              value={city}
              onChangeText={setCity}
            />

            <View style={styles.button}>
              <Button
                title="Get Weather"
                onPress={fetchWeather}
                disabled={!city.trim()}
                color={city.trim() ? '#007AFF' : '#aaa'}
              />
            </View>

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            {weather && (
              <View style={styles.resultBox}>
                <Text style={styles.city}>
                  {weather.location.name}, {weather.location.country}
                </Text>
                <Text style={styles.temp}>{weather.current.temp_c}°C</Text>
                <Text style={styles.condition}>{weather.current.condition.text}</Text>
                <Text style={styles.details}>Humidity: {weather.current.humidity}%</Text>
                <Text style={styles.details}>Wind: {weather.current.wind_kph} km/h</Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height,
    width,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    gap: 7,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 22.5,
    fontSize: 13,
    marginBottom: 6,
  },
  button: {
    width: '100%',
    marginBottom: 6,
  },
  error: {
    color: '#fff',
    backgroundColor: 'rgba(200,0,0,0.6)',
    padding: 4,
    fontSize: 12,
    borderRadius: 4,
    textAlign: 'center',
    marginTop: 4,
  },
  resultBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: .2,
  },
  city: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  temp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  condition: {
    fontSize: 13,
    color: '#444',
    textTransform: 'capitalize',
  },
  details: {
    fontSize: 12 ,
    color: '#333',
    marginTop: height * 0.005,
    flex:1,
  },
});