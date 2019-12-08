
const STATUS = defineEnum({
  HIDE:  0,
  SHOW:  1,
  PRESS: 2
})

const MOGURA_TYPE = [
  {point: 1, durationTime: 1000, imgShow: "images/モグ2.png", imgPress: "images/モグ1.png"},
  {point: 2, durationTime:  850, imgShow: "images/モグ3.png", imgPress: "images/モグ4.png"},
  {point: 3, durationTime:  750, imgShow: "images/ゴブ1.png", imgPress: "images/ゴブ2.png"},
];

/*
const MOGURA_TYPE = defineEnum({
  NORMAL: {
    value: 0,
    point: 1,
    durationTime: 1000,
    imgShow: "images/モグ2.png",
    imgPress: "images/モグ1.png"
  },
  SUNGLASSES: {
    value: 1,
    point: 2,
    durationTime: 850,
    imgShow: "images/モグ3.png",
    imgPress: "images/モグ4.png"
  },
  GOBURIN: {
    value: 2,
    point: 3,
    durationTime: 700,
    imgShow: "images/ゴブ1.png",
    imgPress: "images/ゴブ2.png"
  }
})*/

let gamePoint = 0;

function addPoint(point){
  gamePoint += point;
  console.log(`得点：${gamePoint}`);
}
// 親側で 「モグラごとのID値」をもっておき、それを v-for で回す際の key に指定すれば、
// 似たようなオブジェクトを９つ生成できる・・・？
// -> できそう。html的なテンプレートだけでなく、computed や dataのデフォルト値をprops で指定したり、
// computed: あたりの設定もテンプレートにできるはず、確か。



// シンプルに「親子コンポーネント」で考えるのであれば、
// 親はゲームコントローラ、子はモグラとなる。モグラは親に「叩かれたよ！」と伝える、これがeventで、
// xxxxx 親は「君、生まれ変わろっか」とモグラのタイプの変更を命じる。これがprops。
// xxxxx 疑問：props を渡すタイミングを
// 訂正。親からprops で生まれ変わりを命じる必要はない。モグラの初期作成時に値を渡す必要があるから、
// せいぜい props はそこをやるぐらいか。

// 一回まとめよう。
// モグラをVueインスタンスにしたい。それをできるだけ効率よくやるにはどうすべきか。
// まず、最もシンプルな、直感的な方法を考える。

// 1, id に mogura1 とか割り振っておき、それを new Vue で毎回生成する
// 2, id に mogura1 とか割り振っておき、new Vue を拡張して宣言文を短くする - Vue.extend
// 3, Vue.component を使い、HTML要素の template だけを使用する
// 4, !!! - Vue.component を使い、HTML要素の template に加えて、methods: あたりもコンポーネント化する
// 5, xxxx _ 92ページの「描画関数」を参考に、id に mogura-1 とかつける処理を自動化する

// => ４を一旦採用してみる




// 今日習ったことを活かすなら・・・？
// まずは「v-for とか使わずに、ただ親から子へ値をprops で渡す」ことを考えてみよう
// これについては、「最終的に表示したい画像」を渡すことになるのだろう
// しかし、イメージと違うな。・・・いや、待て、違う。
// v-for でやったように、テンプレートのタグの中で v-model:"hoge" を使えば、その値と双方向データバインドするんだ
// なので、v-for して繰り返させる中で（繰り返さなくてもいいけど）、
// v-model:"画像算出メソッド" とすればよいだろう


// id を指定する方式で、Vueオブジェクトが変化すれば画像が変わる状況を実装できた
// !!CLEAR!! -- 課題１：このVueオブジェクトに「typeが変わる処理」を実装して、画像が変わることを確認
// 課題２：el: を指定せずに、あとで $mount する手法を試す

/*
let moguraObj = new Vue({
  el: '#mogura-1',
  data: {
    type: MOGURA_TYPE.NORMAL.value,
    status: STATUS.HIDE
  },
  computed: {
    image: function(){
      switch(this.status){
        case STATUS.SHOW:
          return MOGURA_TYPE.getByValue('value', this.type).imgShow;
        case STATUS.PRESS:
          return MOGURA_TYPE.getByValue('value', this.type).imgPress;
        default:
          return ;
      }
    }
  },
  methods: {
    // モグラの種類をシャッフル
    shuffle_type: function(){
      let random = Math.floor(Math.random() * 10);
      if(random > 8){
        this.type = MOGURA_TYPE.GOBURIN.value
      }else if(random > 6){
        this.type = MOGURA_TYPE.SUNGLASSES.value
      }else{
        this.type = MOGURA_TYPE.NORMAL.value
      }
    },
    // クリック時の処理
    press: function(){
      // 得点が増える処理（未実装）
      console.log('PRESS!');
      // ステータスを「叩かれた」に変更
      this.status = STATUS.PRESS;
      setTimeout(this.hide, 500);
    },
    // 顔を出す処理
    show: function(){
      if(this.status == STATUS.PRESS) return;
      this.shuffle_type();
      this.status = STATUS.SHOW;
      setTimeout(this.autoHide, 700);
    },
    // 隠れる処理
    hide: function(){
      //console.log('HIDE!');
      this.status = STATUS.HIDE;
    },
    autoHide: function(){
      //console.log('AUTO-HIDE!!');
      if(this.status != STATUS.SHOW) return;
      this.hide();
    },
  },
  // ゲーム開始時に実行すべき処理
  mounted: function(){
    // 自動で顔を出す
    // TODO: 顔を出す時間をランダムにする
    setInterval(this.show, 500 + Math.floor(Math.random() * 2000));
  }
})
*/
// 次は、このVueインスタンスを、コンポーネント形式にする
// 1, 知っている範囲 - コンポーネントのうち、URL埋め込みだけ実行する
// 2, 

/*
 * 
 Vue.component('mogura', {
  data: function(){
    return {
      type: MOGURA_TYPE.SUNGLASSES.value,
      status: STATUS.SHOW,
    }
  },
  props: ['image'],
  template: `
    <div>
      <img class="ana" src="images/穴.png">
      <img class="mogura uwagaki" v-bind:src="image" v-on:click="press">
    </div>
  `,
  methods: {
    press: function(){
      // 得点が増える処理（未実装）
      console.log('PRESS!');
      this.status = STATUS.PRESS;
    }
  }
})

 */


Vue.component('mogura', {
/*
  data: function(){
    return {
      type: MOGURA_TYPE.SUNGLASSES.value,
      status: STATUS.SHOW,
    }
  },
*/
  props: {
    id: {},
    image: {
      type: String
    },
  },
  template: `
    <div>
      <img class="ana" src="images/穴.png">
      <img class="mogura uwagaki" v-bind:src="image" v-on:click="press">
    </div>
  `,
  methods: {
    press: function(){
      console.log('子コンポーネント側：ヒット');
      console.log(this.id);

      //console.log('PRESS!');
      this.$emit('hit', this.id);
      // TODO: 得点が増える処理（未実装）
      // Vueインスタンスに、自分のID値を伝える

      //this.status = STATUS.PRESS;
    },
  },

})

// 
let initData = [];
for(i=0; i<9; i++){
  initData.push({id: `${i+1}`,status: STATUS.HIDE, type: MOGURA_TYPE.NORMAL.value});
}
let moguras = new Vue({
  el: '.field',
  data: {
    images: initData,
    /*[
      {id: 1, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 2, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 3, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 4, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 5, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 6, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 7, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 8, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
      {id: 9, status: STATUS.SHOW, type: MOGURA_TYPE.NORMAL.value},
    ],*/
    
  },
  methods: {
    getRandomMogura: function(){
      let random = Math.floor(Math.random() * 10);
      if(random > 8) return MOGURA_TYPE.GOBURIN.value;
      if(random > 6) return MOGURA_TYPE.SUNGLASSES.value;
      return MOGURA_TYPE.NORMAL.value;
    },
    /*
    shuffleMoguras: function(){
      this.images.forEach(el => {
        if(el.status != STATUS.HIDE) return;
        let random = Math.floor(Math.random() * 10);
        if(random > 8) {
          el.type = MOGURA_TYPE.GOBURIN.value;
        } else if(random > 6) {
          el.type = MOGURA_TYPE.SUNGLASSES.value;
        } else {
          el.type = MOGURA_TYPE.NORMAL.value;
        }
      });
    },
    */
    hitAndHide: function(id){
      console.log('親コンポーネントでHitしたよ！');
      console.log(id);
      this.images[`${id-1}`].status = STATUS.PRESS;
      //let point = MOGURA_TYPE.getByValue('value', id).point;
      //console.log(point);
//      addPoint(point);

      // 一定時間後に隠れる
      setTimeout(() => {
        this.images[`${id-1}`].status = STATUS.HIDE;
      }, 500);
    },
  },
  computed: {
    getImages: function(){
      let output = [];
      for(i=0; i<9; i++){
        switch(this.images[i].status){
          case STATUS.SHOW:
            output.push(MOGURA_TYPE.getByValue('value', this.images[i].type).imgShow);
            break;
          case STATUS.PRESS:
            output.push(MOGURA_TYPE.getByValue('value', this.images[i].type).imgPress);
            break;
          default:
            output.push("");
        }
      }
      return output;
    },
  },
  // mounted だとタイミングが悪いのか、たびたびエラーを起こすが、エラーが全く起きない場合もある
    mounted: function(){
      setInterval(() => {
      // TODO: STATUS.SHOW のモグラの中からランダムに選ぶ
      // モグラの穴を選択
      let target = Math.floor(Math.random() * 9);

      // モグラの種類をランダムに変更し、STATUSを変更
      if(this.images[target].status != STATUS.HIDE) return;
      this.images[target].type = this.getRandomMogura();
      this.images[target].status = STATUS.SHOW;

      // TODO: DEBUG用
      // console.log(this.images[target]);
      // console.log(MOGURA_TYPE.getByValue('value', this.images[target].type));
 
      // 顔をだす時間を取得
      // TODO:なぜか MOGURA_TYPE.getByValue('value', this.images[target].type)が取得できないことが多いので、
      // 取得できない場合にはデフォルト値を使用する
      let duration;
      if(!!MOGURA_TYPE.getByValue('value', this.images[target].type)) {
        duration = 500;
      } else {
        duration = MOGURA_TYPE.getByValue('value', this.images[target].type).durationTime
      }
//      let duration = MOGURA_TYPE.getByValue('value', this.images[target].type).durationTime;
      setTimeout(() => {
        if(this.images[target].status == STATUS.SHOW) this.images[target].status = STATUS.HIDE;
      },duration);
    }, 300);
  },
})

/*
let moguraObj1 = {
  data: {
    type: MOGURA_TYPE.NORMAL.value,
    status: STATUS.HIDE
  },
  computed: {
    image: function(){
      switch(this.status){
        case STATUS.SHOW:
          return MOGURA_TYPE.getByValue('value', this.type).imgShow;
        case STATUS.PRESS:
          return MOGURA_TYPE.getByValue('value', this.type).imgPress;
        default:
          return ;
      }
    }
  },
  methods: {
    // モグラの種類をシャッフル
    shuffle_type: function(){
      let random = Math.floor(Math.random() * 10);
      if(random > 8){
        this.type = MOGURA_TYPE.GOBURIN.value
      }else if(random > 6){
        this.type = MOGURA_TYPE.SUNGLASSES.value
      }else{
        this.type = MOGURA_TYPE.NORMAL.value
      }
    },
    // クリック時の処理
    press: function(){
      // 得点が増える処理（未実装）
      console.log('PRESS!');
      // ステータスを「叩かれた」に変更
      this.status = STATUS.PRESS;
      setTimeout(this.hide, 500);
    },
    // 顔を出す処理
    show: function(){
      if(this.status == STATUS.PRESS) return;
      this.shuffle_type();
      this.status = STATUS.SHOW;
      setTimeout(this.autoHide, 700);
    },
    // 隠れる処理
    hide: function(){
      //console.log('HIDE!');
      this.status = STATUS.HIDE;
    },
    autoHide: function(){
      //console.log('AUTO-HIDE!!');
      if(this.status != STATUS.SHOW) return;
      this.hide();
    },

  },
  // ゲーム開始時に実行すべき処理
  mounted: function(){
    // 自動で顔を出す
    // TODO: 顔を出す時間をランダムにする
    setInterval(this.show, 1000);
  }
}

let moguraObj2 = Object.assign({}, moguraObj1);
let moguraObj3 = Object.assign({}, moguraObj1);
let moguraObj4 = Object.assign({}, moguraObj1);
let moguraObj5 = Object.assign({}, moguraObj1);
let moguraObj6 = Object.assign({}, moguraObj1);
let moguraObj7 = Object.assign({}, moguraObj1);
let moguraObj8 = Object.assign({}, moguraObj1);
let moguraObj9 = Object.assign({}, moguraObj1);
let vue1 = new Vue(moguraObj1).$mount("#mogura-1");
let vue2 = new Vue(moguraObj2).$mount("#mogura-2");
let vue3 = new Vue(moguraObj3).$mount("#mogura-3");
let vue4 = new Vue(moguraObj4).$mount("#mogura-4");
let vue5 = new Vue(moguraObj5).$mount("#mogura-5");
let vue6 = new Vue(moguraObj6).$mount("#mogura-6");
let vue7 = new Vue(moguraObj7).$mount("#mogura-7");
let vue8 = new Vue(moguraObj8).$mount("#mogura-8");
let vue9 = new Vue(moguraObj9).$mount("#mogura-9");
*/

/*
      switch(this.status){
        case STATUS.SHOW:
          return MOGURA_TYPE.getByValue('value', this.type).imgShow;
        case STATUS.PRESS:
          return MOGURA_TYPE.getByValue('value', this.type).imgPress;
        default:
          return ;
      }
*/



/*
// ゲームのスコアを加算する
// 参考：「開眼！JavaScript」101p
let plusScore = function(){
  let score = 0;
  return function(){
    return ++score;
  };
}();

function GameController(){
  let timeLimit = 30;

  // モグラオブジェクトを初期化
  const moguras = document.querySelectorAll('.mogura');
  moguras.forEach((element) => { InitMogura(element); })

  function start(){
    // 顔を出す処理
    let interval = setInterval(() => {
      let random = Math.floor(Math.random() * 9);
      moguras[random].show();
    }, 300);
  
    // 残り時間
    let timeLimitInterval = setInterval(() => {
      document.getElementById('remainingTime').textContent = '残り時間 : ' + --timeLimit;
      if(timeLimit == 0){
        clearTimeout(interval);
        clearTimeout(timeLimitInterval);
        // 関数実行時に +1 されてしまうので -1
        const score = plusScore() - 1;
        alert('ゲーム終了 得点 : ' + score);        
      }
    }, 1000)
  }
  start();
}
GameController();
*/
/*
function InitMogura(image){
  // 初期：隠れた状態
  image.status = STATUS.HIDE;

  image.durationTime = 1000;

  // 通常モグラ、グラサン、ゴブリンから選択
  image.moguraType = MOGURA_TYPE.NORMAL.value;

  // image.moguraType を参照し、得点、画像を変更
  image.setProperty = function(){
    // ポイント設定
    image.point = MOGURA_TYPE.getByValue('value', image.moguraType).point;
    // 顔を出す時間
    image.durationTime = MOGURA_TYPE.getByValue('value', image.moguraType).durationTime;
    // プロパティに画像を追加 -- imgShow(顔を出す), imgPress(叩かれ顔)
    image.imgPress = MOGURA_TYPE.getByValue('value', image.moguraType).imgPress;
    image.imgShow  = MOGURA_TYPE.getByValue('value', image.moguraType).imgShow;
  }
  image.setProperty();

  // 叩く
  image.onclick = function(){
    for(i=0; i<this.point; i++){
      document.getElementById('gamePoint').textContent = '得点 : ' + plusScore();
    }
    this.status = STATUS.PRESS;
    this.src = image.imgPress;
    clearTimeout(this.autoHide);
    setTimeout((image) => { image.hide() }, 500, this);
  }

  image.hide = function(){
    this.status = STATUS.HIDE;
    this.src = "";
  }

  // 顔を出す
  image.show = function(){
    if(image.status != STATUS.HIDE){
      return false;
    }
    this.shuffleType();
    this.status = STATUS.SHOW;
    this.src = image.imgShow;
    // 一定時間後に隠れる
    this.autoHide = setTimeout((image) => { image.hide(); }, this.durationTime, this) 
    return true;
  }

  // 普通モグラ、グラサン、ゴブリン、をランダムに入れ替える
  // -- 変更するプロパティ -> type, imgShow, imgHide
  image.shuffleType = function(){
    let random = Math.floor(Math.random() * 10);
    let moguraType;
    if(random > 8){
      moguraType = 2;
    } else if(random > 6) {
      moguraType = 1;
    } else {
      moguraType = 0;
    }
    image.moguraType = moguraType;
    image.setProperty();
  }
}
*/