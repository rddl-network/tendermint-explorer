<template lang="pug">
tm-page(:title="`CID ${cid}`")
  div(v-if="!loading")
    part-cid-data(
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
import PartCidData from './PartCIDData'
import { TmListItem, TmPage, TmPart, TmToolBar } from "@tendermint/ui"

export default {
  name: "page-cid",
  components: {
    TmToolBar,
    TmListItem,
    TmPart,
    TmPage,
    PartCidData
  },
  computed: {
    ...mapGetters(["blockchain"]),

    cid() {
      return this.$route.params.cid
    },
    decodeCID () {
      return Object.assign(this.cid_content)
    },
  },
  data: () => ({
    jsonUrl: "",
    cid_content: void 0,
    loading: true

  }),
  methods: {
    async fetchCID() {
      this.loading=true
      let cid_res = await axios.get(`${this.blockchain.cid_resolver}/entry/cid?cid=${this.$route.params.cid}`)
      this.cid_url = cid_res.data.url
      this.cid_content = cid_res.data
      this.loading=false
      let cid_content_json = await axios.get(cid_res.data.url)
      this.cid_content = JSON.parse( `{ "cid": "${cid_res.data.cid}", "URL": "${cid_res.data.url}", "content": "${cid_content_json.data}"}`)
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
