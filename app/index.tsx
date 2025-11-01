import { Button, PermissionsAndroid, Platform, View } from "react-native";
import { File, Directory, Paths } from 'expo-file-system'
import RNFS from 'react-native-fs'
import { shareAsync } from 'expo-sharing'
import { useEffect, useState } from "react";
export default function Index() {
const [downloadPath, setDownloadPath] = useState<string | null>(null);
  useEffect(() => {
    const checkPermission = async () => {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      )

      if (Platform.OS === 'android' && !result) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'We need access to save files!',
            buttonPositive: 'Yes',
          }
        );
        console.log('Permission granted:', granted);
      }
    };
    checkPermission();
  }, []);

  useEffect(() => {
    const getDownloadPath = async () => {
      const path = await RNFS.DownloadDirectoryPath;
      setDownloadPath(path);
    };
    getDownloadPath();
  }, []);


const Basic = ()=>{
RNFS.readDir(RNFS.DownloadDirectoryPath) // On Android, use "RNFS.DownloadDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
    console.log('GOT RESULT', result);

    // stat the first file
    return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  })
  .then((statResult) => {
    if (statResult[0].isFile()) {
      // if we have a file, read it
      return RNFS.readFile(statResult[1]);
    }

    return 'no file';
  })
  .then((contents) => {
    // log the file contents
    console.log("Contents",contents);
  })
  .catch((err) => {
    console.log("ERRORORRRRRR",err.message, err.code);
  });
  }


  const handlePressFIle1 = () => {
    try {
      const file = new File(Paths.document, `example-${new Date().toISOString()}.txt`)
      file.create()
      file.write("Hello world, mero naam sameer, just Created")
      console.log("FIleInfo:",file.info())
      save(file.uri)
    } catch (err) {
      console.log("ERR PRESS1",err)
    }
  }

  const save = async (uri: string) => {
    if (Platform.OS === 'android') {
      const permissions = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE')
      if (permissions) {
        try{
          const file = new File(uri)
          const moveFile = new File(RNFS.DownloadDirectoryPath,`example-${new Date().toISOString()}.txt`)
          file.move(moveFile)
          console.log("FILE TO MOVE",file.info())
          console.log("FILE MOVED",moveFile.info())
        }catch(err){
          try{
            RNFS.moveFile(uri,RNFS.DownloadDirectoryPath)
            console.log("FILE MOVED using RNFS")
          }catch(err){

            shareAsync(uri)
          }
        }
      } else {
        shareAsync(uri)
      }
  }
}

  const CreatorFile = ()=>{
  var path = RNFS.DownloadDirectoryPath + `/test-${new Date().toISOString()}.txt`;

// write the file
  RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
  .then((success) => {
    console.log('FILE WRITTEN!');
  })
  .catch((err) => {
    console.log("ERR writing:",err.message);
  });
  }

  const Deleter = async ()=>{
    var path = RNFS.DownloadDirectoryPath + '/test.txt';
console.log("DELETE PATH",path);
return RNFS.unlink(path)
  .then(() => {
    console.log('FILE DELETED');
  })
  // `unlink` will throw an error, if the item to unlink does not exist
  .catch((err) => {
    console.log("ERR deleting",err.message);
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
