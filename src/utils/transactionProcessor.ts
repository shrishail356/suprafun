interface TransactionRecord {
    hash: string;
    header: {
      sequence_number: number;
      gas_unit_price: number;
      max_gas_amount: number;
      expiration_timestamp: {
        utc_date_time: string;
      };
      sender: {
        Move: string;
      };
    };
    block_header: {
      hash: string;
      height: number;
      timestamp: {
        utc_date_time: string;
      };
    };
    payload: {
      Move: {
        type: string;
        function: string;
        arguments: string[];
      };
    };
    output: {
      Move: {
        gas_used: number;
        events: Array<{
          type: string;
          data: {
            amount?: string;
            token_in?: string;
            token_out?: string;
            amount_in?: string;
            amount_out?: string;
            account?: string;
            coin_type?: string;
          };
        }>;
        vm_status: string;
      };
    };
  }
  
  interface SwapTransaction {
    txHash: string;
    action: string;
    sender: string;
    tokenIn: {
      symbol: string;
      amount: number;
    };
    tokenOut: {
      symbol: string;
      amount: number;
    };
    txFee: number;
    confirmationTime: string;
    gasUnitPrice: number;
    maxGasAmount: number;
    expirationTime: string;
    blockHash: string;
    blockHeight: number;
    vmStatus: string;
  }
  
  
  function extractTokenSymbol(fullPath: string): string {
    const parts = fullPath.split("::");
    const lastPart = parts[parts.length - 1];
    return lastPart.replace("Test", "t"); 
  }
  
  
  function convertToDecimal(amount: string): number {
    return Number(amount) / 1_000_000; 
  }
  
  
  export function processSwapTransactions(response: { record: TransactionRecord[] }): SwapTransaction[] {
    const swapTransactions: SwapTransaction[] = [];
  
    for (const record of response.record) {
      
      if (!record.payload.Move.function.includes("::entry::swap")) {
        continue;
      }
  
      
      let tokenIn = { symbol: "", amount: 0 };
      let tokenOut = { symbol: "", amount: 0 };
  
      
      for (const event of record.output.Move.events) {
        if (event.type.includes("WeightedPoolSwapEvent") || event.type.includes("StablePoolSwapEvent")) {
          if (event.data.token_in && event.data.token_out && event.data.amount_in && event.data.amount_out) {
           
            if (!tokenIn.symbol) {
              tokenIn = {
                symbol: extractTokenSymbol(event.data.token_in),
                amount: convertToDecimal(event.data.amount_in)
              };
            }
            
            tokenOut = {
              symbol: extractTokenSymbol(event.data.token_out),
              amount: convertToDecimal(event.data.amount_out)
            };
          }
        }
      }

      const swapTx: SwapTransaction = {
        txHash: record.hash,
        action: "Swap",
        sender: record.header.sender.Move,
        tokenIn,
        tokenOut,
        txFee: record.output.Move.gas_used * record.header.gas_unit_price / 1_000_000,
        confirmationTime: record.block_header.timestamp.utc_date_time,
        gasUnitPrice: record.header.gas_unit_price,
        maxGasAmount: record.header.max_gas_amount,
        expirationTime: record.header.expiration_timestamp.utc_date_time,
        blockHash: record.block_header.hash,
        blockHeight: record.block_header.height,
        vmStatus: record.output.Move.vm_status
      };
  
      swapTransactions.push(swapTx);
    }
  
    return swapTransactions;
  }