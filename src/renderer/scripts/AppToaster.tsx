import {
  ActionProps,
  Classes,
  IconName,
  Intent,
  IToaster,
  IToastProps,
  LinkProps,
  MaybeElement,
  Position,
  ProgressBar,
  Toaster
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';

const ProgressBarToaster: React.FC<{ message: string; isError?: boolean; amount?: number }> = (
  props
) => (
  <>
    {props.message}
    <ProgressBar
      className={classNames('docs-toast-progress', {
        [Classes.PROGRESS_NO_STRIPES]:
          props.isError || props.amount === undefined
            ? false
            : props.amount < 0 || props.amount >= 100
      })}
      value={props.amount ? props.amount / 100 : 0}
    />
  </>
);

export class ProgressToaster {
  message: string;
  updater: (props: IToastProps) => string;
  dismisser: () => void;
  isError = false;
  isValid = true;
  amount = 0;
  timeout = 2000;

  constructor(message: string, updater: (props: IToastProps) => string, dismisser: () => void) {
    this.message = message;
    this.updater = updater;
    this.dismisser = dismisser;
  }

  set(amount: number) {
    this.amount = amount;
    this.render();
  }

  add(amount: number) {
    this.amount += amount;
    this.render();
  }

  dismiss() {
    if (!this.isValid) return;
    // this.dismisser();
    this.isValid = false;
  }

  setMessage(message: string) {
    this.message = message;
    this.render();
  }

  getIcon(): IconName | MaybeElement {
    if (this.amount >= 100) return 'tick-circle' as const;
    if (this.amount < 0 || this.isError) return 'error' as const;
    return 'cloud-download' as const;
  }

  getIsNoStripe() {
    if (this.isError) return true;
    if (this.amount < 0 || this.amount >= 100) return true;
    return false;
  }

  getTitleMessage() {
    if (this.amount < 100) return `${this.message} (${this.amount.toFixed(2)}%)`;
    return `Complete downloading ${this.message}`;
  }

  getMessage() {
    return (
      <>
        {this.message} {this.amount.toFixed(2)}%
        <ProgressBar
          className={classNames('docs-toast-progress', {
            [Classes.PROGRESS_NO_STRIPES]: this.getIsNoStripe()
          })}
          value={this.amount / 100}
        />
      </>
    );
  }

  getTimeout() {
    if (this.amount < 100) return 0;
    return this.timeout;
  }

  getIntent() {
    if (this.amount >= 100) return Intent.SUCCESS;
    if (this.amount < 0 || this.isError) return Intent.DANGER;
    return Intent.NONE;
  }

  getToasterProps() {
    return {
      icon: this.getIcon() as IconName | MaybeElement,
      message: this.getMessage(),
      timeout: this.getTimeout(),
      intent: this.getIntent()
    };
  }

  render() {
    if (!this.isValid) return;
    const newToasterProps = this.getToasterProps();
    this.updater(newToasterProps);
  }

  error(error: string) {
    this.isError = true;
    if (this.isValid) {
      AppToaster.error(error);
      this.render();
    }
  }
}

class ToasterClass {
  toaster: IToaster;
  constructor() {
    this.toaster = Toaster.create({
      className: 'recipe-toaster',
      position: Position.BOTTOM_RIGHT
    });
  }

  error(message = '', icon: IconName | MaybeElement = 'error') {
    console.error(message);
    let outputMsg = message;
    if (typeof message === 'object')
      outputMsg = JSON.stringify(message, Object.getOwnPropertyNames(message), 2);
    this.toaster.show({
      intent: Intent.DANGER,
      message: outputMsg,
      icon,
      timeout: 0
    });
  }

  log(message = '', icon: IconName | MaybeElement = 'info-sign') {
    this.toaster.show({
      intent: Intent.NONE,
      message,
      icon
    });
  }

  alert(message = '', icon: IconName | MaybeElement = 'notifications') {
    this.toaster.show({
      intent: Intent.PRIMARY,
      message,
      icon
    });
  }

  success(
    message = '',
    icon: IconName | MaybeElement = 'tick-circle',
    action?: ActionProps & LinkProps
  ) {
    this.toaster.show({
      intent: Intent.SUCCESS,
      message,
      icon,
      action
    });
  }

  warn(message = '', icon: IconName | MaybeElement = 'warning-sign') {
    this.toaster.show({
      intent: Intent.WARNING,
      message,
      icon
    });
  }

  progress(message = '') {
    const toasterId = this.toaster.show({
      icon: 'cloud-download',
      message: <ProgressBarToaster message={message} />,
      timeout: 0,
      intent: Intent.NONE
    });
    const updater = (props: IToastProps) => this.toaster.show(props, toasterId);
    const dismisser = () => this.toaster.dismiss(toasterId);
    return new ProgressToaster(message, updater, dismisser);
  }
}

const AppToaster = new ToasterClass();
export default AppToaster;
