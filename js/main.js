
const STATUS = {
  HIDE:  0,
  SHOW:  1,
  PRESS: 2
}
const MOGURAS = {
  NORMAL:     0,
  SUNGLASSES: 1,
  GOBURIN:    2,
}
const MOGURA_TYPE = [
  {point: 1, durationTime: 1000, imgShow: "images/モグ2.png", imgPress: "images/モグ1.png"},
  {point: 2, durationTime:  850, imgShow: "images/モグ3.png", imgPress: "images/モグ4.png"},
  {point: 3, durationTime:  750, imgShow: "images/ゴブ1.png", imgPress: "images/ゴブ2.png"},
];

// イベントバスの実現：スコア増加
let eventBus = new Vue();

// モグラコンポーネント
Vue.component('mogura', {
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
      // Vueインスタンスに 'hit' イベントを伝え、得点の増加を実装
      this.$emit('hit', this.id);
    },
  },

})

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
// モグラたちの最初の状態を生成
let initData = [];
for(i=0; i<9; i++){
  initData.push({id: `${i+1}`,status: STATUS.HIDE, type: MOGURAS.NORMAL});
}

// モグラたちのルートコンポーネント
let moguras = new Vue({
  el: '.field',
  data: {
    images: initData,
    autoShow: "",    
  },
  methods: {
    getRandomMogura: function(){
      let random = Math.floor(Math.random() * 10);
      if(random > 8) return MOGURAS.GOBURIN;
      if(random > 6) return MOGURAS.SUNGLASSES;
      return MOGURAS.NORMAL;
    },
    hitAndHide: function(id){
      this.images[`${id-1}`].status = STATUS.PRESS;

      // IDから叩かれたモグラの種類を特定 -> モグラの種類に応じたポイント数を取得 -> ポイント増加
      let type = this.images[`${id-1}`].type;
      let point = MOGURA_TYPE[type].point;
      eventBus.$emit('addScore', point);

      // 一定時間後に隠れる
      setTimeout(() => {
        this.images[`${id-1}`].status = STATUS.HIDE;
      }, 500);
    },
    stopGame: function(){
      clearInterval(this.autoShow);
      console.log('ゲーム終了！');
    },
  },
  computed: {
    getImages: function(){
      let output = [];
      for(i=0; i<9; i++){
        switch(this.images[i].status){
          case STATUS.SHOW:
            output.push(MOGURA_TYPE[this.images[i].type].imgShow);
            break;
          case STATUS.PRESS:
            output.push(MOGURA_TYPE[this.images[i].type].imgPress);
            break;
          default:
            output.push("");
        }
      }
      return output;
    },
  },
  // TODO: STATUS.SHOW のモグラの中からランダムに選ぶ
  mounted: function(){
    // ゲーム終了の'stopGame'イベントを受け取る
    eventBus.$on('stopGame', this.stopGame);

    // モグラがランダムに顔をだす処理
    this.autoShow = setInterval(() => {
      // モグラの穴を選択
      let target = Math.floor(Math.random() * 9);

      // モグラの種類をランダムに変更し、STATUSを変更
      if(this.images[target].status != STATUS.HIDE) return;
      this.images[target].type = this.getRandomMogura();
      this.images[target].status = STATUS.SHOW;

      // 顔をだす時間を取得
      let duration = MOGURA_TYPE[this.images[target].type].durationTime;
      setTimeout(() => {
        if(this.images[target].status == STATUS.SHOW) this.images[target].status = STATUS.HIDE;
      },duration);
    }, 300);
  },
})

let controller = new Vue({
  el: '#gameController',
  data: { 
    score: 0,
    timeLimit: 30,
  },
  methods: {
    addScore: function(score){
      this.score += score;
    }
  },
  mounted: function(){
    // 'addScore' イベントを受けて、スコアを増やす
    eventBus.$on('addScore', this.addScore);
    // 
    let gameInterval = setInterval(() => {
      this.timeLimit--;
      if(this.timeLimit == 0){
        clearInterval(gameInterval);
        // TODO: モグラの挙動を停止する処理
        eventBus.$emit('stopGame');
      }
    }, 1000)
  }
})
