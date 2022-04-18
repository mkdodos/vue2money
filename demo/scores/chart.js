const ctx = document.getElementById('myChart').getContext('2d');
const bgcolor = [
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
]
const borderColor = [

    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
]


// const data = [{ x: 'Jan', net: 10, cogs: 50, gm: 50 }, { x: 'Feb', net: 12, cogs: 55, gm: 75 }];


const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        // labels: ['愷軒', '崇恩', '庭瑋', '庭瑜', '韋瑄'],
        labels: [],
        datasets: [
            //第一組    
            {
                // label: '英文聽力',
                data: [],
                // parsing: {
                //     yAxisKey: 'net'
                // },
                backgroundColor: bgcolor,
                borderColor: borderColor,
                borderWidth: 1
            },

        ]
    },
    
    options: {
        // 條寬
        barPercentage: 0.5,
        scales: {
            y: {
                min: 0,
                max: 25,
            }
        },
        plugins: {
           
           // 圖例說明
           legend: {
               display: false,
               position: 'top',
               labels: {
                   // color: 'rgb(255, 99, 132)'
               }
           },
           datalabels:{
               anchor:'end',
               align:'end',
               offset:'5'
           }
       },
    },
    plugins: [ChartDataLabels]
})

export default  myChart 