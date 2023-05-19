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
    verified: undefined,
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
      this.verified = await this.verifySignature(cid_content_json.data)

      this.cid_content = this.cid_content = {
        "cid": cid_res.data.cid,
        "URL": cid_res.data.url,
        "content": JSON.stringify(cid_content_json.data),
      };
      if (this.verified !== undefined) {
        this.cid_content.verified = this.verified;
      }
    },
    async verifySignature(cid_content) {
      // Ensure cid_content contains the necessary properties
      console.log(cid_content)
      if (!cid_content || !cid_content.PublicKey || !cid_content.EnergySig || !cid_content.EnergyHash) {
        console.log("Required property missing from cid_content");
        return undefined;
      }
      console.log(cid_content)
      let pub_key = cid_content.PublicKey
      let signature = cid_content.EnergySig
      let hash = cid_content.EnergyHash

      // You might want to wrap the following in a try/catch block in case the request fails
      try {
        let verify_res = await axios.post(`${this.blockchain.verify_signature}/validate/hash?pub_key=${pub_key}&signature=${signature}&data=${hash}`)
        return verify_res.data.is_valid
      } catch (error) {
        console.error("Failed to verify signature: ", error);
      }
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
