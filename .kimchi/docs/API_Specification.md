# IEB Election 2026 — API Endpoints (Minimal)

For backend developer. Only the endpoints needed for login, logout, candidate profile, and voter home candidates.

---

## 1. POST /api/auth/login

**Sent BY the app (JSON body):**

```json
{
  "user_id": "demo1",
  "password": "123"
}
```

**Must RETURN (JSON response):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "user_id": "demo1",
    "full_name": "Engr. Md. Ashraful Islam",
    "role": "candidate",
    "position": "President",
    "membership_no": "IEB-880123",
    "profile_photo_url": "https://your-cdn.com/photos/ashraful.jpg"
  }
}
```

---

## 2. POST /api/auth/logout

**Sent BY the app:**

Headers only: `Authorization: Bearer <token>`

No JSON body.

**Must RETURN:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 3. GET /api/candidates

**Sent BY the app:**

No auth required. This endpoint is public — anyone visiting the app can see the candidates list (voter home screen and candidates screen).

Optional query params: `?position=President&search=ashraful`

**Must RETURN (JSON response):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "name": "Engr. Md. Ashraful Islam",
      "position": "President",
      "institution": "BUET",
      "organization": "PDB",
      "profile_photo_url": "https://your-cdn.com/photos/ashraful.jpg",
      "position_color": "#1A4789"
    },
    {
      "id": "uuid-124",
      "name": "Engr. Farhana Rahman",
      "position": "Vice President",
      "institution": "CUET",
      "organization": "PDB",
      "profile_photo_url": "https://your-cdn.com/photos/farhana.jpg",
      "position_color": "#E67E22"
    }
  ]
}
```

---

## 4. GET /api/candidates/:id

Public candidate detail (the screen that opens when a voter taps "View" on a candidate card). No auth needed.

**Sent BY the app:**

No auth required.

URL param: `:id` = the candidate's `id` (e.g. `uuid-123`)

**Must RETURN (JSON response):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "name": "Engr. Md. Ashraful Islam",
    "position": "President",
    "institution": "BUET",
    "organization": "PDB (Power Dev. Board)",
    "designation": "Chief Engineer",
    "membership_no": "IEB-880123",
    "email": "ashraful@pdb.gov.bd",
    "phone": "+880 171-234-5678",
    "election_year": "2026",
    "slogan": "Together We Build, Together We Lead",
    "profile_photo_url": "https://your-cdn.com/photos/ashraful.jpg",
    "position_color": "#1A4789",
    "manifesto_url": "https://your-cdn.com/manifestos/ashraful.pdf",
    "photos": [
      "https://your-cdn.com/photos/ashraful_1.jpg",
      "https://your-cdn.com/photos/ashraful_2.jpg"
    ],
    "videos": [
      "https://your-cdn.com/videos/ashraful_1.mp4"
    ]
  }
}
```

---

## 5. GET /api/candidates/me

**Sent BY the app:**

Headers: `Authorization: Bearer <token>`

**Must RETURN (JSON response):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "user_id": "demo1",
    "full_name": "Engr. Md. Ashraful Islam",
    "membership_no": "IEB-880123",
    "organization": "PDB (Power Dev. Board)",
    "designation": "Chief Engineer",
    "institution": "BUET",
    "email": "ashraful@pdb.gov.bd",
    "phone": "+880 171-234-5678",
    "position": "President",
    "election_year": "2026",
    "slogan": "Together We Build, Together We Lead",
    "profile_photo_url": "https://your-cdn.com/photos/ashraful.jpg",
    "campaign_progress": 72,
    "kpi": {
      "total_voters": 12456,
      "contacted_voters": 4320,
      "supporters": 3215,
      "messages_sent": 2850
    }
  }
}
```

---

## 6. PUT /api/candidates/me

**Sent BY the app (JSON body):**

```json
{
  "full_name": "Engr. Md. Ashraful Islam",
  "membership_no": "IEB-880123",
  "organization": "PDB (Power Dev. Board)",
  "designation": "Chief Engineer",
  "institution": "BUET",
  "email": "ashraful@pdb.gov.bd",
  "phone": "+880 171-234-5678",
  "position": "President",
  "election_year": "2026",
  "slogan": "Together We Build, Together We Lead"
}
```

**Must RETURN (JSON response):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-123",
    "user_id": "demo1",
    "full_name": "Engr. Md. Ashraful Islam",
    "membership_no": "IEB-880123",
    "organization": "PDB (Power Dev. Board)",
    "designation": "Chief Engineer",
    "institution": "BUET",
    "email": "ashraful@pdb.gov.bd",
    "phone": "+880 171-234-5678",
    "position": "President",
    "election_year": "2026",
    "slogan": "Together We Build, Together We Lead",
    "profile_photo_url": "https://your-cdn.com/photos/ashraful.jpg"
  }
}
```

---

## 7. POST /api/candidates/me/photo

**Sent BY the app (multipart/form-data):**

Field: `photo` (type: FILE, jpg/png image)

**Must RETURN (JSON response):**

```json
{
  "success": true,
  "message": "Photo updated successfully",
  "data": {
    "profile_photo_url": "https://your-cdn.com/photos/ashraful_v2.jpg"
  }
}
```
