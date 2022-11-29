const request_url = require("supertest")("http://barru.pythonanywhere.com");
const assert = require("chai").expect;

let random_text = Math.random().toString(36).substring(7); //generate random text
let authorize_value = ""; //global authorization with empty value

describe("POST /login", function () { // JUDUL, JADI SINGKAT AJA
  it("Verify Success Login with valid email and password", async function () { // DESKRIPSI
    const response = await request_url // INI BUAT NGARAH KE URL BARRU.PYTHONANYWHERE.COM
      .post("/login") // INI ENDPOINT SETELAH .COM
      .send({ email: "tester@jago.com", password: "testerjago" }); // INI SESUAI BODY

    const isi_data = response.body;

    assert(response.body.status).to.eql('SUCCESS_LOGIN');
    assert(response.body.message).to.eql('Anda Berhasil Login');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Login with additional parameter", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "seecan95@gmail.com", password: "seecan95"});

    const isi_data = response.body;

    assert(response.body.status).to.eql('SUCCESS_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Login with Random Authorization", async function () { 
    const response = await request_url 
      .post("/login")
      .set({ Authorization: `Bearer asjdhgagduahuidghaiduawgdiuwaghsgjhagdjhgdshjsgd` })
      .send({ email: "tester@jago.com", password: "testerjago"});

    const isi_data = response.body;

    assert(response.body.status).to.eql('SUCCESS_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with invalid email and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "seecan95", password: "testerjago" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with random email and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "seecan.asdajsdasdasd@bkabka.com", password: "testerjago" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with phone number and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "088823772363", password: "testerjago" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });


  it("Verify Failed Login with username and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "seecan950", password: "testerjago" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });


  it("Verify Failed Login with empty email and valid password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "", password: "testerjago" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with empty Body Only Dictionary", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ });

      assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with empty email and empty password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "", password: "" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with valid email and empty password", async function () { 
    const response = await request_url 
      .post("/login")
      .send({ email: "tester@jago.com", password: "" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with SQLI in password", async function () { 
    const response = await request_url
      .post("/login")
      .send({ email: "tester@jago.com", 
              password: "SELECT%count%(*)%FROM%Users%WHERE%Username='jebol'%or%1=1%--%'%AND%Password=%'email'"});

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.message).to.eql("Tidak boleh mengandung symbol");
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with SQLI in email", async function () { 
    const response = await request_url
      .post("/login")
      .send({ email: "SELECT%count%(*)%FROM%Users%WHERE%Username='jebol'%or%1=1%--%'%AND%Password=%'email'", 
              password: "shanatester"});

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.message).to.eql("Cek kembali email anda");
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

describe("Verify Max Login for User in 1 IP Address", function () { 
  for (i = 0; i<5; i++) {
    let nomer = i;
    it("Tes ke " + [i] + " Failed Login Max in 1 Session", async function () { 
      const response = await request_url
        .post("/login")
        .send({ email: "dicobain@tester.com", password: "sampeblokir", ip_address: "127.107.42.1"});

      const isi_data = response.body;

      if (nomer === 4) {
        // console.log("Tes ke " + nomer + " failed login attemp")
        assert(response.body.status).to.eql('FAILED_LOGIN');
        assert(response.body.data).to.eql('IP Address Anda diblokir');
        assert(isi_data).to.include.keys("data", "message", "status");
      }

      assert(response.body.status).to.eql('FAILED_LOGIN');
      assert(isi_data).to.include.keys("data", "message", "status"); 
    });
  }
});

it("Verify Failed Login with Max Char in Email Field", async function () {
    let max_email = Array.from(Array(55), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
    .post("/login") 
    .send({ email: max_email + "@gmail.com", password: "aditya.qa" });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.data).to.eql('Email/Password melebihin maksimal karakter');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with Max Char in Password Field", async function () {
    let max_password = Array.from(Array(55), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
    .post("/login") 
    .send({ email: 'tester@jago.com', password: max_password });

    const isi_data = response.body;

    assert(response.body.status).to.eql('FAILED_LOGIN');
    assert(response.body.data).to.eql('Email/Password melebihin maksimal karakter');
    assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Login with Method GET", async function () {
    const response = await request_url
    .get("/login") 
    .send({ email: 'tester@jago.com', password: 'testerjago' });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Login with Method PUT", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
    .put("/login") 
    .send({ email: 'tester@jago.com', password: 'testerjago' });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Login with Method PATCH", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
    .patch("/login") 
    .send({ email: 'tester@jago.com', password: 'testerjago' });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Login with Form-Data as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .type('form')
      .send({ email: 'tester@jago.com', password: 'testerjago' });

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with xx-www-form-urlencoded as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .set('content-Type', 'application/x-www-form-urlencoded')
      .send({ email: 'tester@jago.com', password: 'testerjago' });

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with Integer Type in Email", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .send({ email: 123456789, password: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Login with Integer Type in Password", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/login")
      .send({ email: random_text + "@gmail.com", password: 123456789});

    assert(response.status).to.eql(500);
  });
});



describe("POST /register then /login to get a valid authorization value", function () {
    it("Verify Success Register First", async function () {
        const response = await request_url
          .post("/register")
          .send({ email: random_text + "@gmail.com", password: random_text, name: random_text });
    });

    it("Verify Success Login", async function () { 
    const response = await request_url
        .post("/login")
        .send({ email: random_text + "@gmail.com", password: random_text });

        authorize_value = response.body.credentials.access_token; //update empty authorization with valid value
    });
});

describe("POST /delete-user", function () {
    it("Verify Failed Delete User without Authorization", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .send({ password: random_text});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with Invalid Password", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: "sigantengnih"});

        const isi_data = response.body;

        assert(response.body.status).to.eql('FAILED_DELETE_PROFILE');
        assert(response.body.message).to.eql('Gagal Hapus Akun');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Empty String", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: ""});

        const isi_data = response.body;

        assert(response.body.status).to.eql('FAILED_DELETE_PROFILE');
        assert(response.body.message).to.eql('Gagal Hapus Akun');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Integer value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: 1});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with Max Character", async function () {
        let max_pass = Array.from(Array(40), () => Math.floor(Math.random() * 36).toString(36)).join(''); 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: max_pass});

        const isi_data = response.body;

        assert(response.body.status).to.eql('FAILED_DELETE_PROFILE');
        assert(response.body.message).to.eql('Gagal Hapus Akun');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });
    
    it("Verify Failed Delete User with Older Authorization", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: '5836a5287ae73353561d307b72fe908b54bffd0a3113b708144c764dd7f5fdk2' })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Empty Authorization", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: '' })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Bearer Authorization and valid value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ name: "sman60jakarta"});

        assert(response.status).to.eql(500);
    });

    it("Verify Failed Delete User with Bearer Authorization and valid value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: 'Bearer ' + authorize_value  })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with Bearer Authorization and wrong value", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: 'Bearer ' + 'hahahaahhahahahahahahahahahahaa'  })
            .send({ password: "sman60jakarta"});

        const isi_data = response.body;

        assert(response.body.data).to.eql("User's not found");
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });

    it("Verify Failed Delete User with GET Request", async function () { 
        const response = await request_url 
            .get("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        assert(response.status).to.eql(405); 
    });

    it("Verify Failed Delete User with POST Request", async function () { 
        const response = await request_url 
            .post("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        assert(response.status).to.eql(405); 
    });

    it("Verify Failed Delete User with PATCH Request", async function () { 
        const response = await request_url 
            .patch("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        assert(response.status).to.eql(405); 
    });

    it("Verify Failed Delete User with empty body only dictionary", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with xx-www-form-urlencoded as Body", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set('content-Type', 'application/x-www-form-urlencoded')
            .set({ Authorization: authorize_value })
            .send({ password: "sman60jakarta"});

        assert(response.status).to.eql(500); 
    });

    it("Verify Failed Delete User with xx-www-form-urlencoded as Body", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .type('form')
            .set({ Authorization: authorize_value })
            .send({ password: "sman60jakarta"});

        assert(response.status).to.eql(500); 
    });

    it("Verify Success Delete User", async function () { 
        const response = await request_url 
            .del("/delete-user")
            .set({ Authorization: authorize_value })
            .send({ password: random_text});

        const isi_data = response.body;

        assert(response.body.status).to.eql('SUCCESS_DELETE_PROFILE');
        assert(response.body.message).to.eql('Berhasil Hapus User');
        assert(isi_data).to.include.keys("data", "message", "status"); 
    });
});

describe("POST /login to get a valid authorization value", function () {
  it("Verify Success Login First", async function () { 
  const response = await request_url
      .post("/login")
      .send({ email: "testerjago@gmail.com", password: "sman60jakarta" });

      authorize_value = response.body.credentials.access_token; //update empty authorization with valid value
  });
});

describe("PUT /update-profile", function () {
  it("Verify Success Update Username", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: "sitampan tester"});

      const isi_data = response.body;

      assert(response.body.status).to.eql('SUCCESS_UPDATE_PROFILE');
      assert(response.body.message).to.eql('Berhasil Perbarui Profile');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Update Username with Additional Data", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: "sitampan nyoba", email: "email.ngga.berubah@gmail.com"});

      const isi_data = response.body;

      assert(response.body.status).to.eql('SUCCESS_UPDATE_PROFILE');
      assert(response.body.message).to.eql('Berhasil Perbarui Profile');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Update Username with Space", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: "  siganteng  "});

      const isi_data = response.body;

      assert(response.body.status).to.eql('SUCCESS_UPDATE_PROFILE');
      assert(response.body.message).to.eql('Berhasil Perbarui Profile');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Update Username without Authorization", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .send({ name: "sitampan beraksi"});

      assert(response.status).to.eql(500); 
  });

  it("Verify Failed Update Username with Symbol", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: "sit@mpan*%"});

      const isi_data = response.body;

      assert(response.body.status).to.eql('FAILED_UPDATE_PROFILE');
      assert(response.body.message).to.eql('Tidak boleh mengandung symbol');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Update Username with Empty String", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: ""});

      const isi_data = response.body;

      assert(response.body.status).to.eql('FAILED_UPDATE_PROFILE');
      assert(response.body.data).to.eql('Username tidak boleh kosong');
      assert(response.body.message).to.eql('Gagal Update Profile');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Update Username with Integer value", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: 1});

      assert(response.status).to.eql(500); 
  });

  it("Verify Failed Update Username with Max Character", async function () {
      let max_name = Array.from(Array(30), () => Math.floor(Math.random() * 36).toString(36)).join(''); 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: max_name});

      const isi_data = response.body;

      assert(response.body.status).to.eql('FAILED_UPDATE_PROFILE');
      assert(response.body.data).to.eql('Username melebihin maksimal karakter');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });
  
  it("Verify Failed Update Username with Older Authorization", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: 'd96f44863e92b8ec526622071bc00dcc8c020a9bde97f1112ed7c7ddc3d5a218' })
          .send({ name: "lholho"});

      const isi_data = response.body;

      assert(response.body.data).to.eql("User's not found");
      assert(response.body.message).to.eql('Credential is not valid');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Update Username with Empty Authorization", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: '' })
          .send({ name: "testing"});

      const isi_data = response.body;

      assert(response.body.data).to.eql("User's not found");
      assert(response.body.message).to.eql('Credential is not valid');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Update Username with Bearer Authorization and valid value", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: 'Bearer ' + authorize_value  })
          .send({ name: "testing"});

      const isi_data = response.body;

      assert(response.body.data).to.eql("User's not found");
      assert(response.body.message).to.eql('Credential is not valid');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Update Username with Bearer Authorization and wrong value", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set({ Authorization: 'Bearer ' + 'd96f44863e92b8ec526622071bc00dcc8c020a9bde97f1112ed7c7ddc3d5a218'  })
          .send({ name: "testing"});

      const isi_data = response.body;

      assert(response.body.data).to.eql("User's not found");
      assert(response.body.message).to.eql('Credential is not valid');
      assert(isi_data).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Update Username with GET Request", async function () { 
      const response = await request_url 
          .get("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: "sitampan beraksi"});

      assert(response.status).to.eql(405); 
  });

  it("Verify Failed Update Username with POST Request", async function () { 
      const response = await request_url 
          .post("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: "sitampan beraksi"});

      assert(response.status).to.eql(405); 
  });

  it("Verify Failed Update Username with PATCH Request", async function () { 
      const response = await request_url 
          .patch("/update-profile")
          .set({ Authorization: authorize_value })
          .send({ name: "sitampan beraksi"});

      assert(response.status).to.eql(405); 
  });

  it("Verify Failed Update Username with empty body only dictionary", async function () { 
      const response = await request_url 
          .patch("/update-profile")
          .set({ Authorization: authorize_value })
          .send({});

      assert(response.status).to.eql(405); 
  });

  it("Verify Failed Update Username with xx-www-form-urlencoded as Body", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .set('content-Type', 'application/x-www-form-urlencoded')
          .set({ Authorization: authorize_value })
          .send({ name: "hahaha hehe"});

      assert(response.status).to.eql(500); 
  });

  it("Verify Failed Update Username with Form-Data as Body", async function () { 
      const response = await request_url 
          .put("/update-profile")
          .type('form')
          .set({ Authorization: authorize_value })
          .send({ name: "sitampan hehe"});

      assert(response.status).to.eql(500); 
  });
});

describe("Test POST /REGISTER", function () { // DEKLARASI FUNCTION YANG AKAN DI TES
  it("Verify Success Register", async function () { // TEST CASE
    let random_email = Math.random().toString(36).substring(7); // MEMBUAT RANDOM KATA

    const response = await request_url // INI BUAT NGARAH KE URL BARRU.PYTHONANYWHERE.COM
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: random_email, name: random_email }); // INI SESUAI BODY

    const hasil_response = response.body; // BERISI HASIL RESPONSE HASIL NEMBAK API, ADA DATA, MESSAGE, STATUS

    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Additional IP Address in Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Additional Params", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register?email=lalala&password=hahhaha")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Random Authorization", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .set({ Authorization: `Bearer asjdhgagduahuidghaiduawgdiuwaghsgjhagdjhgdshjsgd` })
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Success Register with Random Authorization and Params", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register?email=bahahahaahaha@gmail.com&password=waluyo")
      .set({ Authorization: `Bearer asjdhgagduahuidghaiduawgdiuwaghsgjhagdjhgdshjsgd` })
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    const hasil_response = response.body;
    assert(response.body.status).to.eql('SUCCESS_REGISTER');
    assert(response.body.data).to.eql('berhasil');
    assert(response.body.message).to.eql('created user!');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Empty Body, Only Dictionary", async function () {
    let random_pass = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ });
    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Empty Password", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password tidak boleh kosong');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Empty Email", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: "", password: "testerjago", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password tidak boleh kosong');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Empty Name", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "testerjago", name: "" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password tidak boleh kosong');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Symbol in Name Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "testerjago", name: random_email + "&#" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Nama atau password tidak valid');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Symbol in Email Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: "#$$$$$", password: "testerjago", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with SQLI in Password Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "SELECT", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Nama atau password tidak valid');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with SQLI in Email Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: "SELECT id FROM users WHERE username='username' AND password='password' OR 1=1", password: "testerjago", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with SQLI in Name Field", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: "testerjago", 
              name: "SELECT%count%(*)%FROM%Users%WHERE%Username='jebol'%or%1=1%--%'%AND%Password=%'email'" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Body Email Only", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com" });

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Body Name Only", async function () {
    let random_name = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ name: random_name});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Body Password Only", async function () {
    let random_pass = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ password: random_pass});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Max Char in Email Field", async function () {
    let random_email = Array.from(Array(55), () => Math.floor(Math.random() * 36).toString(36)).join('');
    let random_pass = Array.from(Array(11), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: random_pass, name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password melebihin maksimal karakter');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with Max Char in Password Field", async function () {
    let random_email = Array.from(Array(10), () => Math.floor(Math.random() * 36).toString(36)).join('');
    let random_pass = Array.from(Array(38), () => Math.floor(Math.random() * 36).toString(36)).join('');
    const response = await request_url
      .post("/register")
      .send({ email: random_email + "@gmail.com", password: random_pass, name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email/Username/Password melebihin maksimal karakter');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register without Body", async function () {
    let random_pass = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Method GET", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .get("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });

    assert(response.status).to.eql(405);
  });

  it("Verify Failed Register with Method PUT", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .put("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });


    assert(response.status).to.eql(405);
  });

  it("Verify Failed Register with Method PATCH", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .patch("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text, ip_address: "127.0.0.1" });


    assert(response.status).to.eql(405);
  });

  it("Verify Failed Register with Form-Data as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .type('form')
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with xx-www-form-urlencoded as Body", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .set('content-Type', 'application/x-www-form-urlencoded')
      .send({ email: random_text + "@gmail.com", password: random_text, name: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Email", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: 123456789, password: random_text, name: random_text});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Name", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: 123456789});

    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Password", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: 123456789, name: random_text});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Email Start with 0", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: 08123456789, password: random_text, name: random_text});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Name Start with 0", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: random_text, name: 08123456789});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Integer Type in Password Start with 0", async function () {
    let random_text = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/register")
      .send({ email: random_text + "@gmail.com", password: 08123456789, name: random_text});

    const hasil_response = response.body;
    assert(response.status).to.eql(500);
  });

  it("Verify Failed Register with Existing Registered Email Gmail", async function () {
    const response = await request_url
      .post("/register")
      .send({ email: "tester@gmail.com", password: "aditya.qa", name: "Test Email Gmail"});
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email sudah terdaftar, gunakan Email lain');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });

  it("Verify Failed Register with (.) in Existing Registered Email Gmail", async function () {
    const response = await request_url
      .post("/register")
      .send({ email: "tes.ter@gmail.com", password: "aditya.qa", name: "Test Email Gmail" });
    const hasil_response = response.body;
    assert(response.body.status).to.eql('FAILED_REGISTER');
    assert(response.body.data).to.eql('Email sudah terdaftar, gunakan Email lain');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
  });
});