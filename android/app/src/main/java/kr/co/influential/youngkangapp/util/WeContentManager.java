package kr.co.influential.youngkangapp.util;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * <PRE> 1. 출처 : 아쿠아 샘플앱에서 옮겨옮 2. FileNae  : WeConentManager.java 3. Package  :
 * kr.co.influential.youngkangapp.manager 4. Comment  : 컨텐츠 정보관리 5. 작성자   : 오키토키 6. 작성일   : 2016.
 * 12. 22. </PRE>
 */

public class WeContentManager extends SQLiteOpenHelper {

  private static final String DATABASE = "welaaa.db";
  private static final int VERSION = 1;
  public final String SYTAX = "<so>";

  private final String DOWNLOAD_CREATE_TABLE =
      "CREATE TABLE IF NOT EXISTS DOWNLOAD (_id integer primary key autoincrement, " +
          "groupkey text not null, ckey text not null, userId text not null," +
          "drmSchemeUuid text not null, drmLicenseUrl text not null, cid text not null, oid text, "
          +
          "contentPath text not null, totalSize text not null, gTitle text not null, cTitle text not null, "
          + "groupImg text not null,  thumbnailImg text not null, audioVideoType text not null, "
          + "groupTeacherName text not null, cPlayTime text not null , "
          +
          "groupContentScnt text not null , groupAllPlayTime text not null , view_limitdate text not null , modified text not null); ";

  private final String PROGRESS_CREATE_TABLE =
      "CREATE TABLE IF NOT EXISTS PROGRESS (_id integer primary key autoincrement, " +
          "cid text not null , duration text not null, playCount text not null , progress text not null , reg_date text not null , server_sync_flag text not null)";

  private final String DOWNLOAD_DROP_TABLE = "DROP TABLE IF EXISTS DOWNLOAD";

  private final String PROGRESS_DROP_TABLE = "DROP TABLE IF EXISTS PROGRESS";

  private SQLiteDatabase db;

  public WeContentManager(Context context, String database) {

    super(context, database, null, VERSION);
    String dbPath = context.getApplicationContext().getDatabasePath("welaaa.db").getPath();
    //  super(context, database, null, VERSION);
    if (db != null && db.isOpen()) {
      db.close();
    }

    db = getWritableDatabase();
    onCreate(db);
  }

  public void openDb() {
    db = getWritableDatabase();
    onCreate(db);
  }

  public String changeSyntax(String data) {
    if (data != null) {
      data = data.replaceAll("\\'", SYTAX);
    } else {
      data = "";
    }

    return data;
  }

  public String changeSyntaxRestore(String data) {
    if (data != null) {
      data = data.replaceAll(SYTAX, "'");
    } else {
      data = "";
    }

    return data;
  }

  @Override
  public void onCreate(SQLiteDatabase db) {
    this.db = db;
    try {
      db.execSQL(DOWNLOAD_CREATE_TABLE);
      db.execSQL(PROGRESS_CREATE_TABLE);

    } catch (Exception e) {

      e.printStackTrace();
    }

  }

  @Override
  public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
    this.db = db;
//		dropTable();
    onCreate(db);
  }

  public void createTable() {
    try {

      db.execSQL(DOWNLOAD_CREATE_TABLE);


    } catch (SQLiteException e) {

    }
  }

  public void dropTable() {
    db.execSQL(DOWNLOAD_DROP_TABLE);
  }

  //EDUMANAGER-226
  public boolean hasProjectName(int id, String projectName) {
    if (!db.isOpen()) {
      openDb();
    }

    if (projectName != null) {
      projectName = projectName.trim();
    }

    String query = "SELECT COUNT(*) AS count FROM PROJECT ";
    query += "WHERE projectname='" + changeSyntax(projectName) + "'";

    if (id != -1) {
      query += "  AND _id <>" + id;
    }

    Cursor c = db.rawQuery(query, null);

    if (c == null) {
      return false;
    }

    c.moveToFirst();

    int pos = c.getColumnIndexOrThrow("count");
    String count = c.getString(pos);

    c.close();

    return (Integer.parseInt(count) != 0);
  }

  //cid와 customerid기준으로 변경
  public ArrayList<HashMap<String, Object>> countDownload(String cid, String customerid)
      throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    String query =
        "SELECT filepath FROM DOWNLOAD WHERE cId='" + cid + "' AND customerId='" + customerid + "'";
    Cursor c = db.rawQuery(query, null);

    int nCount = 0;
    nCount = c.getCount();

    ArrayList<HashMap<String, Object>> data = CursorToDataTable(c);
    return data;
  }

  public int isDownloadExist(String cid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT cId,customerId,filepath FROM DOWNLOAD WHERE cId='" + cid + "'";
    Cursor c = db.rawQuery(query, null);
    int nCount = 0;
    nCount = c.getCount();
    if (c != null) {
      c.close();
    }
    return nCount;
  }

  public void updateDownloadFilePath(String cid, String customerid, String filepath)
      throws Exception {

    if (!db.isOpen()) {
      openDb();
    }
    String sql =
        "UPDATE DOWNLOAD SET filePath='" + filepath + "'WHERE cId='" + cid + "' AND customerId='"
            + customerid + "'";
    db.execSQL(sql);
  }

  public void deleteDownLoadList(String filepath) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    db.delete("DOWNLOAD", "filepath='" + filepath + "'", null);
  }

  public void downloadAdd(String gId, String cId, String userId, String drmSchemeUuid,
      String drmLicenseUrl, String cid,
      String oid, String contentPath, String totalSize, String gTitle, String cTitle,
      String groupImg,
      String thumbnailImg, String contentType,
      String groupTeacherName, String cPlayTime, String groupContentScnt, String groupAllPlayTime,
      String view_limitdate) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    db.execSQL(String.format(
        "INSERT INTO DOWNLOAD ( groupkey, ckey, userId, drmSchemeUuid, drmLicenseUrl, "
            + "cid, oid, contentPath, totalSize, gTitle ,"
            + "cTitle, groupImg, thumbnailImg, audioVideoType, groupTeacherName, "
            + "cPlayTime, groupContentScnt , groupAllPlayTime, view_limitdate , modified) "
            +
            "values ('%s','%s','%s','%s','%s',"
            + "'%s','%s','%s','%s','%s',"
            + "'%s','%s','%s','%s','%s',"
            + "'%s','%s','%s','%s', (datetime('now','localtime')) );",
        gId, cId, userId, drmSchemeUuid, drmLicenseUrl, cid, oid, changeSyntax(contentPath),
        totalSize,
        changeSyntax(gTitle), changeSyntax(cTitle), groupImg, thumbnailImg, contentType,
        groupTeacherName,
        cPlayTime, groupContentScnt, groupAllPlayTime, view_limitdate));
  }

  public void downloadDelete(String gId) {
    if (!db.isOpen()) {
      openDb();
    }
    db.execSQL(
        String.format("DELETE FROM DOWNLOAD WHERE gId='%s' AND NOT totalSize is NULL;", gId));
  }

  public void downloadDelete() {
    if (!db.isOpen()) {
      openDb();
    }
    db.execSQL(String.format("DELETE FROM DOWNLOAD;"));
  }

  //
  public void downloadDeleteFromcid(String cId) {
    if (!db.isOpen()) {
      openDb();
    }
    db.execSQL(
        String.format("DELETE FROM DOWNLOAD WHERE cId='%s'; ", cId));
  }

  public void downLoadModify(String modify, String filePath) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    db.execSQL(
        String.format("UPDATE DOWNLOAD SET modified='%s' WHERE filepath='%s';", modify, filePath));
  }

  public void downLoadFileSize(long totalSize, String filePath) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    db.execSQL(String
        .format("UPDATE DOWNLOAD SET totalSize='%s' WHERE filepath='%s';", "" + totalSize,
            filePath));

  }

  public ArrayList<HashMap<String, Object>> getDownLoadModify(String filePath) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = String.format("SELECT modified FROM DOWNLOAD WHERE filepath='%s'", filePath);

    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public ArrayList<HashMap<String, Object>> getDownLoadFileSize(String filePath) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = String.format("SELECT totalSize FROM DOWNLOAD WHERE filepath='%s'", filePath);

    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public void resetDownLoadModify(String filePath) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    db.execSQL(String
        .format("UPDATE DOWNLOAD SET modified='', totalSize='' WHERE filepath='%s'", filePath));
  }

  //.CDN db에서 그룹키를 기준으로 데이타를 가져온다.
  public ArrayList<HashMap<String, Object>> getGrupDownLoadList() throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT DISTINCT gId FROM DOWNLOAD WHERE NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public ArrayList<HashMap<String, Object>> getGrupDownLoadList(String gid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query =
        "SELECT  gTitle, sumnailImg, groupImg, audioVidoType , groupTeacherName , cPlayTime , cTitle , groupContentScnt , groupAllPlayTime , cId , view_limitdate FROM DOWNLOAD WHERE gId='"
            + gid + "'AND NOT totalSize is NULL";
//        String query = "SELECT  gTitle, sumnailImg, groupImg, audioVidoType , groupTeacherName , cPlayTime , cTitle , groupContentScnt , groupAllPlayTime , cId  FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public ArrayList<HashMap<String, Object>> getGrupDownLoadListALL(String gid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT  * FROM DOWNLOAD WHERE gId='" + gid + "'AND NOT totalSize is NULL";
//        String query = "SELECT  gTitle, sumnailImg, groupImg, audioVidoType , groupTeacherName , cPlayTime , cTitle , groupContentScnt , groupAllPlayTime , cId  FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public ArrayList<HashMap<String, Object>> getGroupFilePath(String gid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT filepath FROM DOWNLOAD WHERE gId='" + gid + "'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  //gId를 기준으로 cId 데이타를 가져온다.
  public ArrayList<HashMap<String, Object>> getContentDownLoadList(String gid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query =
        "SELECT cId, filepath, totalSize, gTitle, cTitle, sumnailImg, audioVidoType, gId , groupTeacherName ,"
            +
            " cPlayTime FROM DOWNLOAD WHERE gId='" + gid + "'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  //gId를 기준으로 cId 데이타를 가져온다.
  public ArrayList<HashMap<String, Object>> getContentTotalSize(String gid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query =
        "SELECT totalSize FROM DOWNLOAD WHERE gId='" + gid + "'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  //cId를 기준으로 PLAYTIME  가져온다.
  public ArrayList<HashMap<String, Object>> getPlayTime(String cid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT PLAYTIME FROM DOWNLOAD WHERE cId='" + cid + "'AND NOT PLAYTIME is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  //cId를 기준으로 totalsize를 가져온다.
  public ArrayList<HashMap<String, Object>> getContentTotalSize2(String cid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query =
        "SELECT totalSize FROM DOWNLOAD WHERE cId='" + cid + "'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  //cId를 기준으로 filepath를 가져온다.
  public ArrayList<HashMap<String, Object>> getFilepath(String cid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT filepath FROM DOWNLOAD WHERE cId='" + cid + "'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  //gId를 기준으로 cId 데이타를 가져온다.
  public ArrayList<HashMap<String, Object>> getContentCid(String gid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT cId FROM DOWNLOAD WHERE gId='" + gid + "'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  //cId 기준으로 cTitle , gTitle 데이타를 가져온다.
  public ArrayList<HashMap<String, Object>> getContentTitle(String cid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT cId , gId , gTitle , cTitle FROM DOWNLOAD WHERE cid='" + cid
        + "'AND NOT totalSize is NULL";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public ArrayList<HashMap<String, Object>> getDownLoadList() throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT groupkey, ckey, userId, drmSchemeUuid, drmLicenseUrl, cid, oid, "
        + "contentPath,totalSize,gTitle,cTitle,groupImg,thumbnailImg,audioVideoType,"
        + "groupTeacherName,cPlayTime,groupContentScnt,groupAllPlayTime,view_limitdate,modified "
//        + "FROM DOWNLOAD WHERE NOT totalSize is NULL ";
        + "FROM DOWNLOAD ";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public ArrayList<HashMap<String, Object>> getDownLoadedList(String cid,String userId) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT groupkey, ckey, userId, drmSchemeUuid, drmLicenseUrl, cid, oid, "
        + "contentPath,totalSize,gTitle,cTitle,groupImg,thumbnailImg,audioVideoType,"
        + "groupTeacherName,cPlayTime,groupContentScnt,groupAllPlayTime,view_limitdate,modified "
        + "FROM DOWNLOAD WHERE cid like '" + cid + "%' AND userId='" + userId
        + "'";
    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

  public int getDownLoadedList(String gId, String cId, String customerId) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query =
        "SELECT gId, cId, customerId FROM DOWNLOAD WHERE customerid='" + customerId + "'AND gId='"
            + gId + "' AND cId='" + cId + "'";

    Cursor c = db.rawQuery(query, null);
    int nCount = 0;
    nCount = c.getCount();
    if (c != null) {
      c.close();
    }
    return nCount;
  }

  public boolean existCid(String cId) {

    boolean existCid = false;

    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT cId FROM DOWNLOAD WHERE cId='" + cId + "'";

    Cursor c = db.rawQuery(query, null);
    int nCount = 0;

    nCount = c.getCount();

    if (c != null) {
      c.close();
    }
    if (nCount != 0) {
      existCid = true;
    }
    return existCid;
  }

  public boolean existTotalSizeNullCid(String cId) {

    boolean existCid = false;

    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT cId FROM DOWNLOAD WHERE cId='" + cId + "'AND totalSize is NULL";

    Cursor c = db.rawQuery(query, null);
    int nCount = 0;
    nCount = c.getCount();
    if (c != null) {
      c.close();
    }
    if (nCount != 0) {
      existCid = true;
    }
    return existCid;
  }

  public ArrayList<HashMap<String, Object>> CursorToDataTable(Cursor c) {
    if (c == null || c.getCount() == 0) {
      return null;
    }

    String[] names = c.getColumnNames();
    ArrayList<HashMap<String, Object>> dt = new ArrayList<HashMap<String, Object>>();
    while (c.moveToNext()) {
      HashMap<String, Object> dr = new HashMap<String, Object>();
      for (int j = 0; j < names.length; j++) {
        dr.put(names[j], changeSyntaxRestore(c.getString(j)));
      }
      dt.add(dr);
    }

    c.close();
    return dt;
  }

  public void insertProgress(String cid, String duration
  ) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    db.execSQL(String.format(

        "INSERT INTO PROGRESS ( cid, duration , playCount , progress , reg_date , server_sync_flag)"
            +
            "values ( '%s', '%s' , '1' , '', (datetime('now','localtime')) , 'N');",
        cid, duration));
  }

  public ArrayList<HashMap<String, Object>> getProgressCid() throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    String query =
        "SELECT cid , duration , PlayCount , progress , reg_date , server_sync_flag "
            + "FROM PROGRESS ORDER BY reg_date desc";
    Cursor c = db.rawQuery(query, null);

    return CursorToDataTable(c);
  }

  public ArrayList<HashMap<String, Object>> getProgressCid(String cid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    String query =
        "SELECT cid , duration , PlayCount , progress , reg_date , server_sync_flag FROM PROGRESS WHERE cid = '"+cid+"'";
    Cursor c = db.rawQuery(query, null);

    return CursorToDataTable(c);
  }


  public int isProgressExist(String cid) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    String query = "SELECT cId FROM PROGRESS WHERE cid ='" + cid + "'";

    Cursor c = db.rawQuery(query, null);
    int nCount = 0;
    nCount = c.getCount();
    if (c != null) {
      c.close();
    }
    return nCount;
  }

  public void updateProgress(String cid, String duration , String type) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }

    String sql = "";

    if(type.equals("UPDATE")){
      sql =
          "UPDATE PROGRESS SET duration = '" + duration
              + "' , reg_date= datetime('now','localtime') WHERE cid='" + cid + "'";
    }else{
      //INSERT
      sql =
          "UPDATE PROGRESS SET playCount= playCount+1 , duration = '" + duration
              + "' , reg_date= datetime('now','localtime') WHERE cid='" + cid + "'";
    }

    db.execSQL(sql);
  }

  public void deleteProgress(String cid) throws Exception {

    if (!db.isOpen()) {
      openDb();
    }
    String sql = "DELETE FROM PROGRESS WHERE cid='" + cid + "'";
    db.execSQL(sql);
  }

  public ArrayList<HashMap<String, Object>> getDatabase(String userId) throws Exception {
    if (!db.isOpen()) {
      openDb();
    }
    String query = "SELECT * FROM DOWNLOAD WHERE userId = '"+ userId+"' ORDER BY CID ASC";

//    String query = "select distinct cid , gTitle , audioVideoType ,groupTeacherName,view_limitdate , count(*) as groupContentScnt "
//        + "FROM DOWNLOAD "
//        + "WHERE userId = '"+ userId +"' "
//        + "order by cid asc "
//        + "group by gTitle,audioVideoType,groupTeacherName ";

//    String query = "select * from ("
//        +" select * "
//        +" from download "
//        +" order by cid desc "
//        +") as a "
//        +" group by a.gTitle ";

    Cursor c = db.rawQuery(query, null);
    return CursorToDataTable(c);
  }

}
