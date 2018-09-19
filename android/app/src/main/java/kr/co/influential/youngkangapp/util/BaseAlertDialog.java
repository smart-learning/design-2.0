package kr.co.influential.youngkangapp.util;

import android.app.Dialog;
import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.StringRes;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import kr.co.influential.youngkangapp.R;

public class BaseAlertDialog extends Dialog {

  private BaseAlertDialog(@NonNull Context context) {
    super(context, android.R.style.Theme_Translucent_NoTitleBar);
  }

  public static class Builder {

    private Context context;
    private View view;
    private TextView titleView;
    private TextView messageView;
    private Button leftButton;
    private Button rightButton;
    private BaseAlertDialog dialog;

    public Builder(@NonNull Context context) {
      this.context = context;
      view = LayoutInflater.from(context).inflate(R.layout.welean_dialog, null);
      titleView = view.findViewById(R.id.modal_title);
      messageView = view.findViewById(R.id.modal_contnet);
      leftButton = view.findViewById(R.id.modal_left);
      rightButton = view.findViewById(R.id.modal_right);
    }

    public Builder setTitle(String title) {
      titleView.setText(title);
      return this;
    }

    public Builder setTitle(@StringRes int titleRes) {
      titleView.setText(titleRes);
      return this;
    }

    public Builder setMessage(String message) {
      messageView.setText(message);
      return this;
    }

    public Builder setMessage(@StringRes int messageRes) {
      messageView.setText(messageRes);
      return this;
    }

    public Builder setNegativeButton(int textId, final View.OnClickListener listener) {
      return setNegativeButton(context.getString(textId), listener);
    }

    public Builder setNegativeButton(String text, final View.OnClickListener listener) {
      setupButton(leftButton, text, listener);
      return this;
    }

    public Builder setPositiveButton(int textId, final View.OnClickListener listener) {
      return setPositiveButton(context.getString(textId), listener);
    }

    public Builder setPositiveButton(String text, final View.OnClickListener listener) {
      setupButton(rightButton, text, listener);
      return this;
    }

    private void setupButton(Button button, String text, final View.OnClickListener listener) {
      button.setText(text);
      button.setOnClickListener(v -> {
        if (listener != null) {
          listener.onClick(v);
        }
        dialog.dismiss();
      });
    }

    public BaseAlertDialog build() {
      dialog = new BaseAlertDialog(context);
      dialog.setContentView(view);
      dialog.setCancelable(false);
      dialog.setCanceledOnTouchOutside(false);
      return dialog;
    }
  }
}
