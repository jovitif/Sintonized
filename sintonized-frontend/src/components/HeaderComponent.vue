<template>
    <header>
        <div class="logo">
            <img class="profile" src="../assets/icons8-music-record-96.png" alt="icon logo">
            <h1>SINTONIZED</h1>
        </div>
        <img class="profile" src="../assets/profile.jpg" alt="profile">
    </header>
</template>
<script>
export default{
    name:'HeaderComponent',
}
</script>
<style>
.profile{
    border-radius: 50%;
    height: 55px;
}

h1{
    font-size: 27px;
    color: #d1410c;
    margin-left: 10px;
}

header, .logo{
    display: flex;
    flex-direction: row;
}

.logo{
align-items:center
}

header{
justify-content: space-between;
margin: 10px;
padding:  0px;
}
</style>
