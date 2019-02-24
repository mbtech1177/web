class WindowConfirmator extends Confirmator {
  confirm(payload) {
    return window.confirm(payload)
  }
}

class AllowAll extends Confirmator {
  confirm() {
    return true
  }
}
