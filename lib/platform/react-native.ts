export type NativePlatform='web'|'mydevice';
export type NativeStarter='counter'|'list';
type SnackFile={type:'CODE';contents:string};
export const nativeStarters:Record<NativeStarter,{name:string;description:string;files:Record<string,SnackFile>}>= {
 counter:{name:'React Native counter',description:'A multi-file React Native counter with a reusable component.',files:{
  'App.tsx':{type:'CODE',contents:`import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Counter from './components/Counter';

export default function App() {
  return <View style={styles.screen}>
    <Text style={styles.eyebrow}>BUILT WITH SUKOAA</Text>
    <Text style={styles.title}>A little tap.\nA new idea.</Text>
    <Text style={styles.note}>Edit components/Counter.tsx and try the button.</Text>
    <Counter />
  </View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: '#f4f7ee' },
  eyebrow: { color: '#61744f', fontSize: 11, letterSpacing: 2, marginBottom: 18 },
  title: { color: '#204b40', fontSize: 34, fontWeight: '700', marginBottom: 16 },
  note: { color: '#6c7965', fontSize: 15, lineHeight: 23, marginBottom: 28 },
});
`},
  'components/Counter.tsx':{type:'CODE',contents:`import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <View style={styles.card}>
    <Text style={styles.count}>{count}</Text>
    <Pressable accessibilityRole="button" onPress={() => setCount(value => value + 1)} style={styles.button}>
      <Text style={styles.label}>Tap to count</Text>
    </Pressable>
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 22, padding: 26, alignItems: 'center' },
  count: { fontSize: 50, fontWeight: '700', color: '#204b40', marginBottom: 22 },
  button: { backgroundColor: '#204b40', paddingHorizontal: 28, paddingVertical: 15, borderRadius: 12 },
  label: { color: '#e1f1b9', fontSize: 16, fontWeight: '600' },
});
`}
 }},
 list:{name:'React Native searchable list',description:'Practise TextInput, filtering and reusable React Native rows.',files:{
  'App.tsx':{type:'CODE',contents:`import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import ToolRow from './components/ToolRow';
const tools = ['JavaScript', 'Python', 'React Native', 'SQL', 'TypeScript'];

export default function App() {
  const [query, setQuery] = useState('');
  const visible = tools.filter(tool => tool.toLowerCase().includes(query.toLowerCase()));
  return <View style={styles.screen}>
    <Text style={styles.title}>Find your next tool.</Text>
    <TextInput accessibilityLabel="Search tools" placeholder="Try Python" value={query} onChangeText={setQuery} style={styles.input} />
    <ScrollView>{visible.map(tool => <ToolRow key={tool} name={tool} />)}
      {!visible.length && <Text>No tools match your search.</Text>}
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f7ee', padding: 24, paddingTop: 70 },
  title: { color: '#204b40', fontSize: 28, fontWeight: '700', marginBottom: 24 },
  input: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 20 },
});
`},
  'components/ToolRow.tsx':{type:'CODE',contents:`import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
export default function ToolRow({ name }: { name: string }) {
  return <View style={styles.row}><Text style={styles.text}>{name}</Text></View>;
}
const styles = StyleSheet.create({
  row: { padding: 20, borderRadius: 12, backgroundColor: '#ffffff', marginBottom: 12 },
  text: { fontSize: 17, color: '#204b40' },
});
`}
 }}
};
export function nativeSnackUrl(starter:NativeStarter,platform:NativePlatform,embedded=true){
 if(!Object.hasOwn(nativeStarters,starter))throw new Error('Unknown React Native starter.');
 if(platform!=='web'&&platform!=='mydevice')throw new Error('Unsupported preview platform.');
 const selected=nativeStarters[starter],url=new URL(embedded?'https://snack.expo.dev/embedded':'https://snack.expo.dev/');
 url.searchParams.set('name','Sukoaa · '+selected.name);
 url.searchParams.set('description',selected.description);
 url.searchParams.set('files',JSON.stringify(selected.files));
 url.searchParams.set('platform',platform);
 url.searchParams.set('supportedPlatforms','web,mydevice');
 url.searchParams.set('preview','true');
 url.searchParams.set('theme','light');
 return url.href;
}
