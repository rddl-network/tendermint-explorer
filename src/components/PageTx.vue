<template lang="pug">
tm-page(:title="`Transaction ${hash}`")
  div(slot="menu"): tm-tool-bar
    router-link(:to="`/blocks/${height}`")
      i.material-icons chevron_left
      | Block {{ height }}
    a(:href="jsonUrl" target="_blank") JSON

  div(v-if="decodedTx")
    part-tx-data(
      :data="decodedTx"
      name="Transaction Details"
      pathPrefix="tx."
      :includeFields="[]"
      :excludeFields="[]"
    )
  tm-part(v-else title="Transaction was not found")
</template>

<script>
import { mapGetters } from "vuex"
import axios from "axios"
import PartTxData from './PartTxData'
import { TmListItem, TmPage, TmPart, TmToolBar } from "@tendermint/ui"

export default {
  name: "page-block",
  components: {
    TmToolBar,
    TmListItem,
    TmPart,
    TmPage,
    PartTxData
  },
  computed: {
    ...mapGetters(["blockchain"]),

    hash() {
      return this.$route.params.hash
    },
    prevHeight() {
      return this.block.header.height - 1
    },
    nextHeight() {
      return this.block.header.height + 1
    },
    decodedTx () {
      let { tx, height } = this
      if (!tx) return
      
      let txHash = this.tx.id
      let block = {
        isRouterLink: true,
        title: "View block details",
        text: height,
        to: { name: "block", params: { block: height } }
      }
      return Object.assign({ block, txHash }, tx)
    },
  },
  data: () => ({
    jsonUrl: "",
    // hash: this.$route.params.hash,
    tx: void 0,
    height: "",
  }),
  methods: {
    async fetchTx() {
      this.jsonUrlTx = `${this.blockchain.pm_rpc}/api/v1/transactions/${this.hash}`
      let jsonTx = await axios.get(this.jsonUrlTx)

      this.jsonUrlBlk = `${this.blockchain.pm_rpc}/api/v1/blocks?transaction_id=${this.hash}`
      let jsonBlk = await axios.get(this.jsonUrlBlk)
      this.height = jsonBlk.data.height
      this.tx = jsonTx.data
      if(("data" in jsonTx.data.assets)==true){
        let cid = jsonTx.data.assets.data.replace(/"/g, '') 
        this.tx.assets.data = {
          isRouterLink: true,
          title: "View CID details",
          text: cid,
          to: "/cids/"+cid 
        }
      }
      else{
        for (var i=0; i < jsonTx.data.assets.length; i++) {
          let cid = this.tx.assets[i].data.replace(/"/g, '')
          this.tx.assets[i].data = {
              isRouterLink: true,
              title: "View CID details",
              text: cid,
              to: "/cids/"+cid 
          }
        }
      }
    },
  },
  async mounted() {
    await this.fetchTx()
  },
  watch: {
    // eslint-disable-next-line
    '$route'(to, from) {
      this.fetchTx()
    }
  }
}
</script>
