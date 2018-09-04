package kr.co.influential.youngkangapp.util;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.AsyncTask;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.InputStream;
import java.util.ArrayList;

import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.player.NewWebPlayerInfo;
import kr.co.influential.youngkangapp.player.PlayerActivity;
import kr.co.influential.youngkangapp.player.WebPlayerInfo;

public class HLVAdapter extends RecyclerView.Adapter<HLVAdapter.ViewHolder> {

  private final String WELEARN_WEB_URL = Utils.welaaaWebUrl();
  private final String TAG = "HLVAdapter";

  private final int STARTACTIVITY_RESULT_CODE = 1001;

  ArrayList<String> totalTime;
  ArrayList<String> endTime;
  ArrayList<String> ckey;
  ArrayList<String> viewhit;
  ArrayList<String> starCnt;
  ArrayList<String> reviewhit;

  ArrayList<String> groupTitle;
  ArrayList<String> alImage;
  ArrayList<String> groupTeacherName;

  String currentCkey = "";

  Context context;

  private PlayerActivity mWelaaaPlayer = null;

  private NewWebPlayerInfo mNewWebPlayerInfo = null;
  private WebPlayerInfo oldmWebPlayerInfo = null;

  public HLVAdapter(Context context, PlayerActivity welaaaPlayer, ArrayList<String> groupTitle,
      ArrayList<String> alImage,
      ArrayList<String> groupTeacherName, ArrayList<String> totalTime, ArrayList<String> endTime,
      ArrayList<String> viewhit, ArrayList<String> starCnt, ArrayList<String> reviewhit,
      ArrayList<String> ckey, String currentCkey) {
    super();
    this.context = context;
    this.groupTitle = groupTitle;
    this.alImage = alImage;
    this.groupTeacherName = groupTeacherName;

    this.totalTime = totalTime;
    this.endTime = endTime;
    this.viewhit = viewhit;
    this.starCnt = starCnt;
    this.reviewhit = reviewhit;
    this.ckey = ckey;
    this.mWelaaaPlayer = welaaaPlayer;
    this.currentCkey = currentCkey;
  }

  @Override
  public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
    View v = LayoutInflater.from(viewGroup.getContext())
        .inflate(R.layout.grid_item, viewGroup, false);
    ViewHolder viewHolder = new ViewHolder(v);
    return viewHolder;
  }

  @Override
  public void onBindViewHolder(ViewHolder viewHolder, int i) {

    final int pos = i;

    viewHolder.relatedTitle.setText(groupTitle.get(i));
    viewHolder.relatedTitle.setShadowLayer(3, 1, 2, Color.parseColor("#82000000"));

    viewHolder.relatedTeacherName.setText(groupTeacherName.get(i));

    viewHolder.related_number.setText(String.valueOf(i + 1));
    viewHolder.related_number.setShadowLayer(3, 1, 2, Color.parseColor("#82000000"));

    try {

      String[] timesplitTotalTime = totalTime.get(i).split(":");

      if (timesplitTotalTime[0].equals("00")) {

        viewHolder.grid_item_total_time
            .setText(timesplitTotalTime[1] + ":" + timesplitTotalTime[2]);
      } else {
        viewHolder.grid_item_total_time.setText(totalTime.get(i));
      }

    } catch (Exception e) {
      e.printStackTrace();
    }

    viewHolder.related_viewcnt.setText(viewhit.get(i));
    viewHolder.related_myrepucnt.setText(starCnt.get(i));
    viewHolder.related_reviewcnt.setText(reviewhit.get(i));

    // endTime msec
    // totalTime XX:XX:XX 7
    //

    try {

      String[] timesplit = totalTime.get(i).split(":");

      int totalTime = 0;
      int totalTimeHour = 0;
      int totalTimeMin = 0;
      int totalTimeSec = 0;
      int endTimeTmp = Integer.parseInt(endTime.get(i));

      if (timesplit[0].equals("00")) {

        totalTimeMin = Integer.parseInt(timesplit[1]);
        totalTimeSec = Integer.parseInt(timesplit[2]);

        totalTime = ((totalTimeMin * 60) + totalTimeSec) * 1000;
      } else {
        totalTimeHour = Integer.parseInt(timesplit[0]);
        totalTimeMin = Integer.parseInt(timesplit[1]);
        totalTimeSec = Integer.parseInt(timesplit[2]);

        totalTime = ((totalTimeHour * 60 * 60) + (totalTimeMin * 60) + totalTimeSec) * 1000;
      }

      if (endTimeTmp == 9999999) {
        // 100 %
      } else {
        int progressBar = (int) ((float) endTimeTmp / (float) totalTime * 100);

        if (progressBar > 0) {

          ViewGroup.LayoutParams params = viewHolder.progressBarView.getLayoutParams();

          params.width = progressBar;

          viewHolder.progressBarView.setLayoutParams(params);

          viewHolder.progressBarView.requestLayout();
        }
      }

    } catch (Exception e) {
      e.printStackTrace();
    }

    if (ckey.get(i).equals(currentCkey)) {

      viewHolder.imgThumbnail_select.setVisibility(View.VISIBLE);
      viewHolder.imgThumbnail_select_check.setVisibility(View.VISIBLE);

      if (!alImage.get(i).contains("http://")) {

        new DownloadImageTask(viewHolder.imgThumbnail).execute("http://" + alImage.get(i));
      } else {

        new DownloadImageTask(viewHolder.imgThumbnail).execute(alImage.get(i));
      }

    } else {

      viewHolder.imgThumbnail_select.setVisibility(View.GONE);
      viewHolder.imgThumbnail_select_check.setVisibility(View.GONE);

      if (!alImage.get(i).contains("http://")) {
        new DownloadImageTask(viewHolder.imgThumbnail).execute("http://" + alImage.get(i));
      } else {
        new DownloadImageTask(viewHolder.imgThumbnail).execute(alImage.get(i));
      }
    }

    viewHolder.setClickListener(new ItemClickListener() {
      @Override
      public void onClick(View view, int position, boolean isLongClick) {
        if (isLongClick) {
          // insert playList .php 호출 되는 구조
//                    mWelaaaPlayer.hlvAdater(ckey.get(position));
        } else {
          // insert playList .php 호출 되는 구조
//                    mWelaaaPlayer.hlvAdater(ckey.get(position));
        }
      }
    });
  }

  @Override
  public int getItemCount() {
    return groupTitle.size();
  }

  public static class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener,
      View.OnLongClickListener {

    public ImageView imgThumbnail;
    public ImageView imgThumbnail_select;
    public ImageView imgThumbnail_select_check;
    public TextView relatedTitle;
    public TextView relatedTeacherName;

    public TextView grid_item_total_time;
    public TextView related_viewcnt;
    public TextView related_myrepucnt;
    public TextView related_reviewcnt;
    public TextView related_number;

    public View progressBarView;

    private ItemClickListener clickListener;

    public ViewHolder(View itemView) {
      super(itemView);
      imgThumbnail = itemView.findViewById(R.id.img_thumbnail);
      imgThumbnail_select = itemView.findViewById(R.id.img_thumbnail_select);
      imgThumbnail_select_check = itemView.findViewById(R.id.img_thumbnail_select_check);

      relatedTitle = itemView.findViewById(R.id.related_Title);
      relatedTeacherName = itemView.findViewById(R.id.related_teacherName);

      grid_item_total_time = itemView.findViewById(R.id.grid_item_total_time);
      related_viewcnt = itemView.findViewById(R.id.related_viewcnt);
      related_myrepucnt = itemView.findViewById(R.id.related_myrepucnt);
      related_reviewcnt = itemView.findViewById(R.id.related_reviewcnt);
      progressBarView = itemView.findViewById(R.id.progressbar_grid_view);

      related_number = itemView.findViewById(R.id.grid_item_no);

      itemView.setOnClickListener(this);
      itemView.setOnLongClickListener(this);


    }

    public void setClickListener(ItemClickListener itemClickListener) {
      this.clickListener = itemClickListener;
    }

    @Override
    public void onClick(View view) {
      clickListener.onClick(view, getPosition(), false);
    }

    @Override
    public boolean onLongClick(View view) {
      clickListener.onClick(view, getPosition(), true);
      return true;
    }
  }


  public class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {

    private ImageView imageView;
    private Bitmap image;

    public DownloadImageTask(ImageView imageView) {
      this.imageView = imageView;
    }

    protected Bitmap doInBackground(String... urls) {
      String urldisplay = urls[0];
      try {
        InputStream in = new java.net.URL(urldisplay).openStream();
        image = BitmapFactory.decodeStream(in);
      } catch (Exception e) {
        image = null;
      }
      return image;
    }

    @SuppressLint("NewApi")
    protected void onPostExecute(Bitmap result) {
      if (result != null) {
        imageView.setImageBitmap(result);
      }
    }
  }

}

