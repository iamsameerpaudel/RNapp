import { Button, PermissionsAndroid, Platform, View } from "react-native";
import { File, Directory, Paths } from 'expo-file-system'
import RNFS from 'react-native-fs'
import { shareAsync } from 'expo-sharing'
export default function Index() {



  const Basic = ()=>{
    // get a list of files and directories in the main bundle
RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
    console.log('GOT RESULT', result);

    // stat the first file
    return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  })
  .then((statResult) => {
    if (statResult[0].isFile()) {
      // if we have a file, read it
      return RNFS.readFile(statResult[1], 'utf8');
    }

    return 'no file';
  })
  .then((contents) => {
    // log the file contents
    console.log(contents);
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
  }


  const handlePressFIle1 = () => {
    console.log(RNFS.DocumentDirectoryPath)
    try {
      const dir = new Directory(Paths.cache)
      const file = new File(Paths.document, `example-${new Date().toLocaleString()}.txt`)
      file.create()
      file.write("Hello world, mero naam sameer, just Created")
      console.log(file.info())
      save(file.uri)
    } catch (err) {
      console.log(err)
    }
  }

  const save = async (uri: string) => {
    if (Platform.OS === 'android') {
      const permissions = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE')
      if (permissions) {
        const file = new File(uri)
        const moveFile = new File(RNFS.DocumentDirectoryPath)
        file.move(moveFile)
      } else {
        const permission = await PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE', {
            title: "Allow access to all files",
        buttonPositive: 'Yes',
        buttonNegative: 'No',
        buttonNeutral: "dunno",
        message: "Needed access to save file"
      })
      if (permission) {
        const file = new File(uri)
        const moveFile = new File(RNFS.DocumentDirectoryPath)
        file.move(moveFile)
      }else{
        shareAsync(uri)
      }
    }
    }
  }

  const CreatorFile = ()=>{
  var path = RNFS.DocumentDirectoryPath + `/test-${new Date().toLocaleString()}.txt`;

// write the file
  RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
  .then((success) => {
    console.log('FILE WRITTEN!');
  })
  .catch((err) => {
    console.log(err.message);
  });
  }

  const Deleter = ()=>{
    var path = RNFS.DocumentDirectoryPath + '/test.txt';

return RNFS.unlink(path)
  .then(() => {
    console.log('FILE DELETED');
  })
  // `unlink` will throw an error, if the item to unlink does not exist
  .catch((err) => {
    console.log(err.message);
  });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="button1" onPress={handlePressFIle1} />
      <Button title="Basic" onPress={Basic} />
      <Button title="Create" onPress={CreatorFile} />
      <Button title="Create" onPress={Deleter} />
    </View>
  );
}
