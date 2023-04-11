export const blockchain = state => state.blockchain
export const blocks = state => state.blockchain.blocks
export const config = state => state.config
export const consensusState = state => state.blockchain.consensusState
export const dumpConsensusState = state => state.blockchain.dumpConsensusState
export const materials = state => state.materials
export const nodes = state => state.blockchain.nodes
export const roundStep = state => state.blockchain.roundStep
export const validators = state => state.blockchain.validators
export const bc = state => state.blockchain

export const latestBlock = (state, getters) => {
  let { blocks } = getters
  if (blocks && blocks.length >= 1) {
    return blocks[0]
  } else {
    let block = {
      header: {
        height: 0,
        time: "",
        last_commit_hash: "",
        num_txs: 0,   // txs in this block
        total_txs: 0, // total txs in blockchain at the moment of this block
      },
      data: {
        txs: [],
      }
    }
    return block
  }
}

export const totalBlocks = (state, getters) => parseInt(getters.latestBlock.header.height)
export const totalTxs = (state, getters) => parseInt(getters.latestBlock.header.total_txs)
