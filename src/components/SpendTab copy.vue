<template>
  <div>
    <v-app>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field v-model="search.keyword" append-icon="mdi-magnify"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="number" v-model="search.y" label="年"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="search.m" label="月"></v-text-field>
          </v-col>
          <v-col>
            <v-btn @click="getDataYM">查詢</v-btn>
          </v-col>
        </v-row>

        <!-- 表格 -->
        <v-row>
          <v-col>
            <v-data-table :headers="headers" :items="rows" :search="search.keyword">
              <!-- <template v-slot:item.cateCht="{ item }">{{ getCateCht(item.cate) }}</template> -->
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  getDoc,
  doc,
  query,
  getDocs,
  // startAt,
  limit,
  where,
  orderBy,
  setDoc,
  Timestamp,
  addDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch
} from "firebase/firestore/lite";
const collection_name = "spends";
export default {
  data() {
    return {
      rows: [],
      headers: [
        { text: "帳戶", value: "account", width: "100" },
        { text: "cate", value: "cate", width: "100" },
        { text: "類別", value: "cateCht", width: "100" },
        { text: "日期", value: "spend_date", width: "100" },
        { text: "項目", value: "note", width: "200" },
        { text: "收入", value: "income", width: "90" },
        { text: "支出", value: "expense", width: "90" }
      ],
      search: { y: 2021 },
      cates: [],
      cate_name: ""
      // cates: [
      //   { cate_id: 256, cate_name: "中文" },
      //   { cate_id: 250, cate_name: "寶" },
      //   { cate_id: 44, cate_name: "試試" }
      // ]
      // cates: [{cate_id:256,cate_name:'中文'}]
    };
  },
  mounted() {
    // Add a new document in collection "cities"
    // this.getCateOLD();
    // this.getCate(212)
    //  this.getCate2()
    // console.log(this.getCate(212));
    // this.getData();
    // this.getDataYM();
    // this.getStocks()
    // this.getCates()
    // this.getCate3()
    // this.getSpends();
    // this.fire2();
    // this.fireAdd()
    this.fireLandmarks2();
  },
  methods: {
    async fireLandmarks2() {
    
    //  const frankDocRef = doc(db, "cities", "frank");
      // await setDoc(frankDocRef, {
      //   name: "Frank",
      //   favorites: { food: "Pizza", color: "Blue", subject: "recess" },
      //   age: 12
      // });
   
      const citiesRef = collection(db, "cities");
      await setDoc(doc(citiesRef, "SF", "landmarks"), {
          name: "Golden Gate Bridge",
          type: "bridge"
        })
    //  await setDoc(doc(citiesRef,"SF" ,{a:1}))
     
    },
    async fireLandmarks() {
      const citiesRef = collection(db, "cities");

      await Promise.all([
        setDoc(doc(citiesRef, "SF", "landmarks"), {
          name: "Golden Gate Bridge",
          type: "bridge"
        }),
        setDoc(doc(citiesRef, "SF", "landmarks"), {
          name: "Legion of Honor",
          type: "museum"
        }),
        setDoc(doc(citiesRef, "LA", "landmarks"), {
          name: "Griffith Park",
          type: "park"
        }),
        setDoc(doc(citiesRef, "LA", "landmarks"), {
          name: "The Getty",
          type: "museum"
        }),
        setDoc(doc(citiesRef, "DC", "landmarks"), {
          name: "Lincoln Memorial",
          type: "memorial"
        }),
        setDoc(doc(citiesRef, "DC", "landmarks"), {
          name: "National Air and Space Museum",
          type: "museum"
        }),
        setDoc(doc(citiesRef, "TOK", "landmarks"), {
          name: "Ueno Park",
          type: "park"
        }),
        setDoc(doc(citiesRef, "TOK", "landmarks"), {
          name: "National Museum of Nature and Science",
          type: "museum"
        }),
        setDoc(doc(citiesRef, "BJ", "landmarks"), {
          name: "Jingshan Park",
          type: "park"
        }),
        setDoc(doc(citiesRef, "BJ", "landmarks"), {
          name: "Beijing Ancient Observatory",
          type: "museum"
        })
      ]);
    },
    async fireBatch() {
      // Get a new write batch
      const batch = writeBatch(db);

      // Set the value of 'NYC'
      const nycRef = doc(db, "cities", "NYC");
      batch.set(nycRef, { name: "New York City" });

      // Update the population of 'SF'
      const sfRef = doc(db, "cities", "SF");
      batch.update(sfRef, { population: 1000000 });

      // Delete the city 'LA'
      const laRef = doc(db, "cities", "LA");
      batch.delete(laRef);

      // Commit the batch
      await batch.commit();
    },
    async fireTransation() {
      const washingtonRef = doc(db, "cities", "DC");
      await updateDoc(washingtonRef, {
        // 更新數值為原本+50
        population: increment(50)
      });
    },
    async fireUpdateIncrement() {
      const washingtonRef = doc(db, "cities", "DC");
      await updateDoc(washingtonRef, {
        // 更新數值為原本+50
        population: increment(50)
      });
    },
    async fireArrayUnion() {
      const washingtonRef = doc(db, "cities", "DC");
      await updateDoc(washingtonRef, {
        // 加入元素到原本的陣列中
        regions: arrayUnion("data_mark")
      });
      await updateDoc(washingtonRef, {
        // 移除元素
        regions: arrayRemove("data_mark")
      });
    },
    async fireUpdateChild() {
      const frankDocRef = doc(db, "users", "frank");
      await setDoc(frankDocRef, {
        name: "Frank",
        favorites: { food: "Pizza", color: "Blue", subject: "recess" },
        age: 12
      });
      // To update age and favorite color:
      await updateDoc(frankDocRef, {
        age: 13,
        "favorites.color": "Red"
      });
    },
    async fireUpdateTime() {
      // Update the timestamp field with the value from the server
      const docRef = doc(db, "cities", "BJ");
      await updateDoc(docRef, {
        timestamp: serverTimestamp()
      });
    },
    async fireUpdate() {
      const docRef = doc(db, "cities", "BJ");
      // const colRef = collection(db,'cities');
      const data = {
        ball: "basket"
      };
      await updateDoc(docRef, data);
    },
    async fireAdd() {
      // 使用 addDoc 可自動生成ID
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "cities"), {
        name: "Tokyo",
        country: "Japan"
      });
      console.log("Document written with ID: ", docRef.id);
    },
    async fire2() {
      const docData = {
        stringExample: "Hello world!",
        booleanExample: true,
        numberExample: 3.14159265,
        dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
        arrayExample: [5, true, "hello"],
        nullExample: null,
        objectExample: {
          a: 5,
          b: {
            nested: "foo"
          }
        }
      };
      await setDoc(doc(db, "data", "one"), docData);
    },
    // 寫入文件資料到 cities 集合,  ID = "LA", 如果資料已存在,會覆蓋
    // 如果集合不存在會自動創建
    async fire1() {
      await setDoc(doc(db, "cities", "LA"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
      });
      const cityRef = doc(db, "cities", "LA");
      // setDoc(cityRef, { capital: true }, { merge: true });
      // merge:true , 資料合併到原文件,不覆蓋
      setDoc(cityRef, { capital: true }, { merge: true });
    },
    async getCates() {
      const refCate = collection(db, "cates");
      const qCate = query(refCate);
      const docCates = await getDocs(qCate);
      docCates.forEach(doc => {
        this.cates.push({ ...doc.data() });
      });
      // console.log(this.cates[0].cate_name)
      this.cate_name = "ddd";
      // this.getCate3()
    },
    getCate3() {
      this.cates.forEach(cate => {
        console.log(cate.cate_name);
      });
      // console.log(this.cates[0])
    },
    async getCate2(cate) {
      const refCate = collection(db, "cates");
      const qCate = query(refCate, where("cate_id", "==", cate), limit(2));
      const docCate = await getDocs(qCate);
      this.cate_name = docCate.docs[0].data().cate_name;
      console.log(this.cate_name);
    },
    async getSpends() {
      // 集合
      const ref = collection(db, "spends");
      // 限制傳回資料,加入條件
      const q = query(ref, where("cate", "!=", 0), limit(2));
      // 文件
      const docStocks = await getDocs(q);
      docStocks.forEach(doc => {
        // this.cate_name = '555'
        // this.getCates()
        this.rows.push({ ...doc.data(), cateCht: this.cate_name });
        // console.log(doc.data())
      });
    },
    async getStocks() {
      // 集合
      const ref = collection(db, "stocks");
      // 限制傳回資料,加入條件
      const q = query(ref, where("stockID", "==", "2330"), limit(2));
      // 文件
      const docStocks = await getDocs(q);
      // const docStocks = await getDocs(ref);
      docStocks.forEach(doc => {
        console.log(doc.data().stockName);
      });
    },
    async getCateOLD() {
      const citiesRef = collection(db, "cates");
      const docSnap = await getDoc(doc(citiesRef, "1KIYvngy6aiF31ha1FQp"));
      console.log(docSnap.data());
    },
    async getCate(cate) {
      let name = "";
      const citiesRef = collection(db, "cates");
      const q = query(citiesRef, where("cate_id", "==", cate));
      const querySnapshot = await getDocs(q);
      name = querySnapshot.docs[0].data().cate_name;
      console.log(name);
      return name;
      // console.log(querySnapshot.docs[0].data().cate_name);
      // querySnapshot.forEach(doc => {
      //   console.log(doc.id, " => ", doc.data());
      // });
    },
    // async getCates() {
    //   const citiesCol = collection(db, collection_name);

    //   const docSnapBig = await getDocs(citiesCol);
    //   docSnapBig.forEach(doc => {
    //     this.cates.push({ ...doc.data(), id: doc.id });
    //   });
    // },
    // 取得類別名稱
    getCateCht(cate) {
      let name = "";
      this.cates.forEach(row => {
        if (row.cate_id == cate) name = row.cate_name;
        console.log(row.cate_name);
      });
      return name;
      // let id = this.cates.filter(row => (row.cate_id = cate));

      // if (id.length > 0) return id[1].cate_name;
      // else console.log(0);

      // return "";

      // let found = this.cates.find(element => element.cate_id = cate);
      // console.log(found);
      // if(found)
      // return found.cate_name
      // return ''

      // var index = this.cates.indexOf();
      // return cate+this.cates[0].cate_name
    },

    async getDataYM() {
      this.rows = [];
      const citiesCol = collection(db, collection_name);
      const q = query(
        citiesCol,
        orderBy("spend_date", "desc"),
        where(
          "spend_date",
          "<",
          this.search.y + "-" + this.search.m + "-" + "01"
        ),
        limit(10)
      );
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      // console.log(this.rows);
    },
    async getData() {
      // this.rows = [];
      const citiesCol = collection(db, collection_name);
      const q = query(citiesCol, orderBy("spend_date", "desc"), limit(100));
      // const q = query(citiesCol, orderBy("expense", "desc"),where('expense','>',1000), limit(100));
      // const q = query(citiesCol, orderBy("expense", "desc"),where('expense','>',100000), limit(100));
      // const q = query(citiesCol, orderBy("expense"), startAt(1000000));

      // 找出某一筆資料 (假設該筆資料的 expense 為 3000)
      // const docSnap = await getDoc(doc(citiesCol, "0WtHUapzuUGo2ao9C2Qh"));
      // 再用此資料為條件 => startAt(3000)
      // const q = query(citiesCol, orderBy("expense"), startAt(docSnap));
      // const q = query(citiesCol, orderBy("expense"), startAt(4000));

      // console.log(docSnap);
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      // console.log(this.rows);
    }
  }
};
</script>

<style>
</style>