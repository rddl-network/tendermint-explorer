<template lang="pug">
tm-page(:title="`CID ${cid}`")
  div(slot="menu"): tm-tool-bar
    router-link(:to="`/tx/${tx}`")
      i.material-icons chevron_left
      | Block {{ height }}
    a(:href="jsonUrl" target="_blank") JSON

  div(v-if="decodeCID")
    part-tx-data(
      :data="decodeCID"
      name="CID Details"
      pathPrefix="cid."
      :includeFields="[]"
      :excludeFields="[]"
    )
  tm-part(v-else title="CID was not found")
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

    cid() {
      return this.$route.params.cid
    },
    tx() {
      return this.$route.params.tx
    },
    decodeCID () {
      let { tx_id, cid } = this
      if (!cid) return
      

      let tx_page = {
        isRouterLink: true,
        title: "View transaction details",
        text: tx,
        to: { name: "tx", params: { tx: tx_id } }
      }
      return Object.assign({ tx_page, tx_id }, tx)
    },
  },
  data: () => ({
    jsonUrl: "",
    // hash: this.$route.params.hash,
    tx: void 0,
    cid: "",
  }),
  methods: {
    async fetchCID() {
      let cid_res = await axios.get(`${this.blockchain.cid_resolver}/entry/cid?cid=${cid}`)
      this.cid_url = cid_res.data.url

      let cid_content_json = await axios.get(cid_res.data.url)
      this.cid_content = cid_content_json.data
    
    },
  },
  async mounted() {
    await this.fetchCID()
  },
  watch: {
    // eslint-disable-next-line
    '$route'(to, from) {
      this.fetchCID()
    }
  }
}
</script>
