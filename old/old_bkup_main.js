
const STATUS = defineEnum({
  HIDE:  0,
  SHOW:  1,
  PRESS: 2
})

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
})

// ここで vue.js バージョンを作成してみる


// モグラオブジェクトが穴の数だけあるとする
// ゲームコントローラはモグラ配列を所有しており、そこに対して命令を下す
// 各モグラオブジェクトが持つべき動きを定義すればいい
// -> 既存のデータ構造を置き換えて書いてみる
// 1, モンスターのタイプ - 通常、グラサン、ゴブリン
// 2, 得点増減数 - 叩くと増減するポイント
// 3, 潜る時間
// 4, 画像１：顔出し
// 5, 画像２：やられた顔
// 6, ◆状態：hide, show, press

// 疑問点：ある Vue 要素がマウントする対象を el: で決定するが、
// もし対象が複数あったら、どういう挙動を取るんだ・・・？

// たとえばこの要素を複数作成したいとする
// つまりDOMにマウントするわけだが、"el" で指定する要素がかぶってはいけないはず・・・
// いや、テンプレートを作成して、v-for...？
// Vueで複数の要素を扱う際に戸惑っているのは、 el を書く必要があるから・・・？
// 全てを Vue オブジェクトにせず、Moguraクラスは作成する・・・？
// ゲームコントローラだけを Vueオブジェクトにする。mogura配列（要素９）を dataプロパティにもつ・・・？

// いや、ゲームコントローラは「ViewModel」のような挙動を必要としないのでは・・・？
// ViewModelの概念に近いのはやはり mogura のほうに思える・・・
// 違うか。Vueオブジェクトのコンストラクタに渡す引数のオブジェクトだけを事前に定義しておいて、
// let mogura_obj = {};
// -> これを new Vue(mogura_obj) したものを９つ作成して、それをGameController が配列として所有すれば良い
// それでも、el がかぶったらダメなのでは・・・？
// -> 大人しく「穴」を用意する際に、el を全部変えて、


// いや、Vueインスタンスを作成してから、あとで mount する方法で、elとかそのときに指定できたりしないか？
// -> 調べてみる。無理なら、したみたいに書くしかないか・・・？
/*
<div id="mogura-1">
  <mogura-template></mogura-template>
</div>
*/
// これまで使ってた方法は、 mogura クラスを持つ要素を全部取得して、それをコンストラクタに渡していた
// 同じようなやり方でマウントできたりせんかな・・・？

// ######################################################
// https://jp.vuejs.org/v2/api/index.html#vm-mount
// Vue.extend という方法があるらしい。これなら、「Vueインスタンス作成時に指定したい要素」を事前に
// 定義できそう。

// つまり、こんな感じに
/*
new MoguraComponent = Vue.extend({
  data: {
    text: 'YEAH!'
  }
})
// んで、これを別個にマウントできる
new MoguraComponent().$mount('#app');
new MoguraComponent({el: '#app'});
*/
// ######################################################

// Vue.component は、今教わった限りだと、htmlの <template> と同じかと思っていたが、そうではなく、
// Vue インスタンス生成の「オプション」を、「コンポーネントとして登録する」ことだった・・・

// Vue のコンポーネントのオプションには props も指定できる。
// これは「親から子へ渡す」とのことだが、俺が data プロパティで指定していた「モグラのタイプ」も
// 「隠れている、というステータス」も渡せるわけか。まあ、ステータスは初期値でいいけど・・・

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



// const moguras = document.querySelectorAll(".mogura");
/*
moguras.forEach((el, i) => {
  new Vue({
    el,

  })
})*/


// 今日習ったことを活かすなら・・・？
// まずは「v-for とか使わずに、ただ親から子へ値をprops で渡す」ことを考えてみよう
// これについては、「最終的に表示したい画像」を渡すことになるのだろう
// しかし、イメージと違うな。・・・いや、待て、違う。
// v-for でやったように、テンプレートのタグの中で v-model:"hoge" を使えば、その値と双方向データバインドするんだ
// なので、v-for して繰り返させる中で（繰り返さなくてもいいけど）、
// v-model:"画像算出メソッド" とすればよいだろう

// 最終的に目指すべきゴールを定義する必要がある
// component というのは、最終的に何を達成するための仕組みなのか。
// コンポーネントとインスタンスは同じであるというなら、
// コンポーネントを定義して、それをHTMLの中に書いて色々書き込むという行為を、
// let vm = new Vue({ ... }) という行為と全く同じであると考えて良いのか？

// ◆mogura-1, mogura-9 を作成して、Vue.extend か Vue.component で宣言したものをsengensitamonowo
// 毎回 $mount させる手法を試してみる


// id を指定する方式で、Vueオブジェクトが変化すれば画像が変わる状況を実装できた
// !!CLEAR!! -- 課題１：このVueオブジェクトに「typeが変わる処理」を実装して、画像が変わることを確認
// 課題２：el: を指定せずに、あとで $mount する手法を試す



/*
let mogura1 = new Vue({
  el: '#mogura-1',
  data: {
    type: MOGURA_TYPE.NORMAL.value,
    status: STATUS.SHOW
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
    }
  }
})*/

// 定期的にモグラの種類を変えさせる
// setInterval(mogura1.shuffle_type, 1000);

// 同じようなモグラオブジェクトを作成したいので、Vueインスタンスに渡すオブジェクトを定義しておく
let moguraObj = {
  data: {
    function(){
      return {
        type: MOGURA_TYPE.NORMAL.value,
        status: STATUS.SHOW
      }
    }
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
    }
  }
}

/*
// let mogura_a = new MoguraObj().$mount('#mogura-a');
let MoguraObj = Vue.extend({
  data: {
    type: MOGURA_TYPE.NORMAL.value,
    status: STATUS.SHOW
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
    }
  }
})
*/

// まず「モグラを指すVueインスタンスを９個、配列として持つゲームコントローラ」を作成しよう
let moguras = [];
moguras.push(new Vue(moguraObj).$mount('#mogura-1'));
moguras.push(new Vue(moguraObj).$mount('#mogura-2'));
moguras.push(new Vue(moguraObj).$mount('#mogura-3'));
moguras.push(new Vue(moguraObj).$mount('#mogura-4'));
moguras.push(new Vue(moguraObj).$mount('#mogura-5'));
moguras.push(new Vue(moguraObj).$mount('#mogura-6'));
moguras.push(new Vue(moguraObj).$mount('#mogura-7'));
moguras.push(new Vue(moguraObj).$mount('#mogura-8'));
moguras.push(new Vue(moguraObj).$mount('#mogura-9'));
for(i=0; i<9;i++){
  setInterval(moguras[i].shuffle_type, 1000);
}







// new MoguraComponent().$mount('#app');
// new MoguraComponent({el: '#app'});



// let moguraBuilder = new Vue({
Vue.component('mogura', {
  props: ['image'],
  template: `
    <div>
      <img class="ana" src="images/穴.png">
      <img class="mogura uwagaki" id="mogura-1" v-bind:src="image">
    </div>
  `,
})
/*
let vm = new Vue({
  // 親要素にVueインスタンスを関連づけ
  el: '#moguras',
  data: {
    imgShow: "images/モグ2.png",
    statusList: [1,1,1,1,1,1,1,1,1]

  }, 
  computed: {
    image: function(){
      return MOGURA_TYPE.getByValue('value', this.statusList[0]).imgShow;
    },
    image1: function(){
      return MOGURA_TYPE.getByValue('value', this.statusList[0]).imgShow;
    },
    image2: function(){
      return MOGURA_TYPE.getByValue('value', this.statusList[1]).imgShow;
    },
    image3: function(){
      return MOGURA_TYPE.getByValue('value', this.statusList[2]).imgShow;
    },

  }
})
*/
let mogura = {
  type: MOGURA_TYPE.NORMAL.value,
  status: STATUS.SHOW
}


Vue.component('test_mogura', {
  props: ['image'],
  template: `
    <div>
      <img class="ana" src="images/穴.png">
      <img class="mogura uwagaki" id="mogura-1" src="{{ image }}">
    </div>
  `,
  data: function(){
    return {
      // モグラのタイプ - 0:normal , 1:sunglasses, 2:goburin
      type: MOGURA_TYPE.NORMAL.value,
      status: STATUS.SHOW
//      status: STATUS.HIDE
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
    }
  },
  computed: {
    image: function(){
      switch (this.status){
        case STATUS.SHOW:
          return this.imgShow;
        case STATUS.PRESS:
          return this.imgPress;
        default:
          return ;
      }
    },
    durationTime: function(){
      return MOGURA_TYPE.getByValue('value', this.type).durationTime;
    },
    point: function(){
      return MOGURA_TYPE.getByValue('value', this.type).point;
    },
    imgPress: function(){
      return MOGURA_TYPE.getByValue('value', this.type).imgPress;
    },
    imgShow: function(){
      return MOGURA_TYPE.getByValue('value', this.type).imgShow;
    }
  }
})




/*
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