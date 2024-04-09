import { UiHelperUtil, customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import styles from './styles.js'
import { state } from 'lit/decorators.js'
import {
  AccountController,
  ConnectionController,
  CoreHelperUtil,
  NetworkController,
  RouterController,
  SendController,
  SnackController
} from '@web3modal/core'

@customElement('w3m-wallet-send-preview-view')
export class W3mWalletSendPreviewView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private token = SendController.state.token

  @state() private sendTokenAmount = SendController.state.sendTokenAmount

  @state() private receiverAddress = SendController.state.receiverAddress

  @state() private gasPrice = SendController.state.gasPric

  @state() private gasPriceInUsd = SendController.state.gasPriceInUsd

  @state() private caipNetwork = NetworkController.state.caipNetwork

  public constructor() {
    super()
    this.unsubscribe.push(
      ...[
        SendController.subscribe(val => {
          this.token = val.token
          this.sendTokenAmount = val.sendTokenAmount
          this.receiverAddress = val.receiverAddress
          this.gasPrice = val.gasPric
          this.gasPriceInUsd = val.gasPriceInUsd
        }),
        NetworkController.subscribeKey('caipNetwork', val => (this.caipNetwork = val))
      ]
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html` <wui-flex flexDirection="column" .padding=${['s', 'l', 'l', 'l'] as const}>
      <wui-flex gap="xs" flexDirection="column" .padding=${['0', 'xs', '0', 'xs'] as const}>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-flex flexDirection="column" gap="4xs">
            <wui-text variant="small-400" color="fg-150">Send</wui-text>
            ${this.sendValueTemplate()}
          </wui-flex>
          <wui-preview-item
            text="${this.sendTokenAmount} ${this.token?.symbol}"
            .imageSrc=${this.token?.iconUrl}
          ></wui-preview-item>
        </wui-flex>
        <wui-flex>
          <wui-icon color="fg-200" size="md" name="arrowBottom"></wui-icon>
        </wui-flex>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="small-400" color="fg-150">To</wui-text>
          <wui-preview-item
            text=${UiHelperUtil.getTruncateString({
              string: this.receiverAddress ?? '',
              charsStart: 4,
              charsEnd: 4,
              truncate: 'middle'
            })}
            address=${this.receiverAddress ?? ''}
            .isAddress=${true}
          ></wui-preview-item>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" .padding=${['xxl', '0', '0', '0'] as const}>
        <w3m-wallet-send-details
          .caipNetwork=${this.caipNetwork}
          .receiverAddress=${this.receiverAddress}
          .networkFee=${this.gasPriceInUsd}
        ></w3m-wallet-send-details>
        <wui-flex justifyContent="center" gap="xxs" .padding=${['s', '0', '0', '0'] as const}>
          <wui-icon size="sm" color="fg-200" name="warningCircle"></wui-icon>
          <wui-text variant="small-400" color="fg-200">Review transaction carefully</wui-text>
        </wui-flex>
        <wui-flex justifyContent="center" gap="s" .padding=${['l', '0', '0', '0'] as const}>
          <wui-button
            class="cancelButton"
            @click=${this.onCancelClick.bind(this)}
            size="lg"
            variant="shade"
          >
            Cancel
          </wui-button>
          <wui-button
            class="sendButton"
            @click=${this.onSendClick.bind(this)}
            size="lg"
            variant="fill"
          >
            Send
          </wui-button>
        </wui-flex>
      </wui-flex></wui-flex
    >`
  }

  // -- Private ------------------------------------------- //
  private sendValueTemplate() {
    if (this.token && this.sendTokenAmount) {
      const price = this.token.price
      const totalValue = price * this.sendTokenAmount

      return html`<wui-text variant="paragraph-400" color="fg-100"
        >$${totalValue.toFixed(2)}</wui-text
      >`
    }

    return null
  }

  private async onSendClick() {
    if (this.token?.address && this.sendTokenAmount) {
      RouterController.pushTransactionStack({
        view: 'Account',
        goBack: false
      })

      const amount = ConnectionController.parseUnits(
        this.sendTokenAmount.toString(),
        Number(this.token.quantity.decimals)
      )

      try {
        if (
          AccountController.state.address &&
          this.sendTokenAmount &&
          this.receiverAddress &&
          this.token.address
        ) {
          await ConnectionController.writeContract({
            fromAddress: AccountController.state.address as `0x${string}`,
            tokenAddress: CoreHelperUtil.extractEthereumAddress(
              this.token.address
            ) as `0x${string}`,
            receiverAddress: this.receiverAddress as `0x${string}`,
            tokenAmount: amount
          })
          RouterController.replace('Account')
          SnackController.showSuccess('Transaction Succesfull')
        }
      } catch (error) {
        SnackController.showError('Something went wrong...')
      }
    } else if (this.receiverAddress && this.sendTokenAmount && this.gasPrice) {
      RouterController.pushTransactionStack({
        view: null,
        goBack: true
      })

      const to = this.receiverAddress as `0x${string}`
      const address = AccountController.state.address as `0x${string}`
      const value = ConnectionController.parseUnits(this.sendTokenAmount.toString(), 18)
      const data = '0x'

      try {
        await ConnectionController.sendTransaction({
          to,
          address,
          data,
          value,
          gasPrice: this.gasPrice
        })
        RouterController.replace('Account')
        SnackController.showSuccess('Transaction Succesfull')
      } catch (error) {
        SnackController.showError('Something went wrong...')
      }
    }
  }

  private onCancelClick() {
    RouterController.goBack()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-wallet-send-preview-view': W3mWalletSendPreviewView
  }
}
