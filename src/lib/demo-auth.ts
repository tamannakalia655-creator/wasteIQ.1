import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  signOut as firebaseSignOut 
} from "firebase/auth"
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  writeBatch 
} from "firebase/firestore"

export interface DemoSessionResult {
  success: boolean
  role: "admin" | "worker"
  uid: string
  email: string
  isAnonymousFallback: boolean
  error?: string
}

// Fixed credentials for reproducible reviewer sessions across devices
export const DEMO_CREDENTIALS = {
  admin: {
    email: "demo.admin@baripada.wasteiq.in",
    password: "ReviewerDemoAdmin2026#",
    label: "Admin Reviewer Demo",
    name: "Hackathon Judge (Municipal Admin)",
    role: "admin" as const
  },
  worker: {
    email: "demo.worker@baripada.wasteiq.in",
    password: "ReviewerDemoWorker2026#",
    label: "Worker Reviewer Demo",
    name: "Bikram Murmu (Sanitation Field Worker)",
    role: "worker" as const
  }
}

/**
 * Initiates an authorized reviewer session with real Firebase Authentication
 * and structured sample civic data for the My Bharat Social Hackathon.
 */
export async function startReviewerDemoSession(
  auth: Auth,
  db: Firestore,
  role: "admin" | "worker"
): Promise<DemoSessionResult> {
  const creds = DEMO_CREDENTIALS[role]
  let authUser = null
  let isAnonymousFallback = false

  // Step 1: Authenticate with Firebase Auth
  try {
    const res = await signInWithEmailAndPassword(auth, creds.email, creds.password)
    authUser = res.user
  } catch (err: any) {
    // If user does not exist, provision the account
    if (
      err.code === "auth/user-not-found" || 
      err.code === "auth/invalid-credential" ||
      err.code === "auth/wrong-password"
    ) {
      try {
        const createRes = await createUserWithEmailAndPassword(auth, creds.email, creds.password)
        authUser = createRes.user
      } catch (createErr: any) {
        // If email auth is disabled or restricted in Firebase console, fall back to anonymous auth
        console.warn("Email provisioning restricted, attempting anonymous auth fallback:", createErr)
        try {
          const anonRes = await signInAnonymously(auth)
          authUser = anonRes.user
          isAnonymousFallback = true
        } catch (anonErr: any) {
          console.error("All Firebase auth strategies failed for demo session:", anonErr)
          throw new Error(
            "Firebase Authentication is not responding. Please enable Anonymous or Email/Password in Firebase Console."
          )
        }
      }
    } else {
      // Any other auth error: fallback to anonymous auth
      console.warn("Sign in error, attempting anonymous auth fallback:", err)
      try {
        const anonRes = await signInAnonymously(auth)
        authUser = anonRes.user
        isAnonymousFallback = true
      } catch (anonErr: any) {
        console.error("Firebase auth failed:", anonErr)
        throw new Error(
          err.message || "Failed to authenticate reviewer demo session."
        )
      }
    }
  }

  if (!authUser) {
    throw new Error("Unable to obtain authenticated user from Firebase.")
  }

  const uid = authUser.uid
  const effectiveEmail = authUser.email || creds.email

  // Step 2: Establish base user document in Firestore with demo isolation flag
  const userDocRef = doc(db, "users", uid)
  await setDoc(userDocRef, {
    id: uid,
    email: effectiveEmail,
    role: role,
    isDemo: true,
    demoRole: role,
    demoBadge: "My Bharat Social Hack Reviewer",
    createdAt: new Date().toISOString()
  }, { merge: true })

  // Step 3: Establish role-specific nested profile for security rules and layout sync
  if (role === "admin") {
    const adminProfileRef = doc(db, "users", uid, "adminProfile", "profile")
    await setDoc(adminProfileRef, {
      id: "profile",
      userId: uid,
      fullName: creds.name,
      email: effectiveEmail,
      mobileNumber: "+91 06792 252000",
      department: "Baripada Municipal Corporation (Sanitation Cell)",
      isDemo: true
    }, { merge: true })
  } else {
    const workerProfileRef = doc(db, "users", uid, "workerProfile", "profile")
    await setDoc(workerProfileRef, {
      id: "profile",
      userId: uid,
      workerName: creds.name,
      workerId: "W-DEMO-01",
      assignedWardId: "8 & 12",
      contactNumber: "+91 94371 88990",
      vehicleNumber: "OD-11-C-4521 (Tata Ace Tipper)",
      isDemo: true
    }, { merge: true })
  }

  // Step 4: Seed sample complaints so judges have immediate interactive data
  await seedDemoComplaints(db, uid, role)

  return {
    success: true,
    role,
    uid,
    email: effectiveEmail,
    isAnonymousFallback
  }
}

/**
 * Seeds sample complaints tied to Baripada locations for demonstration.
 * When a worker demo logs in, active tasks are assigned directly to their uid.
 */
async function seedDemoComplaints(db: Firestore, currentUid: string, role: "admin" | "worker") {
  try {
    const batch = writeBatch(db)

    // Demo Task 1: Assigned to worker if worker demo, otherwise to demo worker
    const cmp1Ref = doc(db, "complaints", "DEMO-CMP-BRP-01")
    batch.set(cmp1Ref, {
      id: "DEMO-CMP-BRP-01",
      title: "Overflowing Smart Bin near Station Market",
      description: "Smart Bin BRP-008 fill level exceeded 92%. Morning commercial vegetable waste requires immediate tipper pickup.",
      location: "Station Road Vegetable Market, Ward 8, Baripada",
      ward: "8",
      wardName: "Bhanjpur Station",
      category: "Overflowing Bin",
      priority: "High",
      status: "In Progress",
      assignedWorkerId: role === "worker" ? currentUid : "demo-worker-uid",
      assignedWorkerName: "Bikram Murmu (Sanitation Field Worker)",
      assignedWardId: "8",
      isDemo: true,
      reporterName: "Rajesh Mohanty (Citizen)",
      reporterContact: "+91 98610 23412",
      binId: "BRP-008",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }, { merge: true })

    // Demo Task 2: Community dumping
    const cmp2Ref = doc(db, "complaints", "DEMO-CMP-BRP-02")
    batch.set(cmp2Ref, {
      id: "DEMO-CMP-BRP-02",
      title: "Commercial Waste Accumulation at Baghra Road",
      description: "Packaging cartons and wet waste reported outside municipal bin boundary.",
      location: "Baghra Road Daily Market, Ward 12, Baripada",
      ward: "12",
      wardName: "Baghra Road",
      category: "Illegal Dumping",
      priority: "Urgent",
      status: "Assigned",
      assignedWorkerId: role === "worker" ? currentUid : "demo-worker-uid",
      assignedWorkerName: "Bikram Murmu (Sanitation Field Worker)",
      assignedWardId: "12",
      isDemo: true,
      reporterName: "Priyanka Behera (Citizen)",
      reporterContact: "+91 94372 99120",
      binId: "BRP-012",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }, { merge: true })

    // Demo Task 3: Unassigned pending complaint (for Admin to demonstrate task assignment)
    const cmp3Ref = doc(db, "complaints", "DEMO-CMP-BRP-03")
    batch.set(cmp3Ref, {
      id: "DEMO-CMP-BRP-03",
      title: "Missed Segregated Collection at Medical Colony",
      description: "Biodegradable green waste was not collected during morning municipal run.",
      location: "Lane 3, MKCG Medical Area, Ward 4, Baripada",
      ward: "4",
      wardName: "Medical Area",
      category: "Missed Collection",
      priority: "Medium",
      status: "Pending",
      isDemo: true,
      reporterName: "Debasis Das (Citizen)",
      reporterContact: "+91 98533 11090",
      binId: "BRP-004",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }, { merge: true })

    // Demo Task 4: Successfully resolved sample
    const cmp4Ref = doc(db, "complaints", "DEMO-CMP-BRP-04")
    batch.set(cmp4Ref, {
      id: "DEMO-CMP-BRP-04",
      title: "Chhau Cultural Ground Garden Cleanup",
      description: "Dry leaves and paper waste cleared and transferred to Ward 6 compost unit.",
      location: "Chhau Ground Garden, Ward 6, Baripada",
      ward: "6",
      wardName: "Chhau Ground",
      category: "Recyclable Waste",
      priority: "Low",
      status: "Resolved",
      assignedWorkerId: role === "worker" ? currentUid : "demo-worker-uid",
      assignedWorkerName: "Bikram Murmu (Sanitation Field Worker)",
      assignedWardId: "6",
      isDemo: true,
      reporterName: "Swarnalata Giri (Citizen)",
      resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
    }, { merge: true })

    await batch.commit()
  } catch (err) {
    console.warn("Demo sample complaints seeding non-blocking error:", err)
  }
}
