import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function App() {
  const [data, setData] = useState('');
  const [fetchData, setfetchData] = useState([]);
  const options = {
    title: 'Select Image',
    type: 'library',
    options: {
      maxWidth: 200,
      maxHeight: 200,
      selectionLimit: 0,
      includeBase64: false,
      mediaType: 'photo',
    },
  };
  const uploadFile = async () => {
    const image = await launchImageLibrary(options);
    const formData = new FormData();

    formData.append('file', {
      uri: image.assets[0].uri,
      type: image.assets[0].type,
      name: image.assets[0].fileName,
    });
    let res = await fetch('https://api.ocr.space/parse/image', {
      method: 'post',

      body: formData,
      headers: {
        isOverlayRequired: true,
        'Content-Type': 'multipart/form-data',
        apikey: 'K86341643688957',
        language: 'eng',
      },
    });
    console.log('responseJson---->', res);
    let responseJson = await res.json();
    setData(responseJson.ParsedResults[0].ParsedText);
  };
  useEffect(() => {
    fetch('https://reqres.in/api/users')
      .then(res => res.json())
      .then(res => setfetchData(res.data));
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Upload a File from Gallery</Text>
      <View style={styles.btn}>
        <TouchableOpacity onPress={uploadFile}>
          <Text style={styles.btnText}>Upload</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={fetchData}
        horizontal={true}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: `${item.avatar}`,
              }}
            />
            <Text style={styles.title}>{item.email}</Text>
            <Text style={styles.title}>
              {item.first_name} <Text>{item.last_name}</Text>
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      {/* {data ? ( */}
      <>
        <Text style={styles.fileHeading}>This is the File Data :</Text>
        <ScrollView style={styles.fileStyle}>
          <Text>{data}</Text>
        </ScrollView>
      </>
      {/* ) : null} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, height: '100%'},
  btn: {
    width: 150,
    height: 35,
    marginTop: 80,
    marginLeft: 100,
    borderWidth: 1,
    borderColor: '#008CBA',
    backgroundColor: '#008CBA',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  tinyLogo: {
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dataStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    width: '100%',
    height: '20%',
  },
  displayStyle: {flexDirection: 'row'},
  fileStyle: {
    width: '90%',
    height: '40%',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
  },
  fileHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginLeft: 20,
    marginTop: 30,
  },
  heading: {
    fontSize: 50,
    fontWeight: 'bold',
    marginLeft: 50,
    marginTop: 50,
    color: 'red',
  },
});
